import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthErrorEvent, OAuthService, OAuthSuccessEvent } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class AuthService {

    protected basePath = 'http://localhost';
    private authenticatedSubject = new BehaviorSubject<boolean>(false);
    private oidcSubject = new BehaviorSubject<boolean>(true);
    public authenticated$ = this.authenticatedSubject.asObservable().pipe(distinctUntilChanged());
    public oidcSubject$ = this.oidcSubject.asObservable().pipe(distinctUntilChanged());
    private initialisedSubject = new BehaviorSubject<boolean>(false);
    public initialised$ = this.initialisedSubject.asObservable();

    private postLoginRedirect: string;


    private accessTokenSubject = new BehaviorSubject<string>(null);
    public accessToken$ = this.accessTokenSubject.asObservable().pipe(distinctUntilChanged());

    constructor(
        private oauthService: OAuthService,
        private http: HttpClient,
        private router: Router
    ) {
    }
    initialise(): void {
        this.getOpenIdConfiguration()
            .subscribe(oidcConfig => {
                if (Object.entries(oidcConfig).length > 0) {
                    this.oidcSubject.next(true)
                    this.configuresso(oidcConfig)
                }
                else {
                    this.oidcSubject.next(false)
                }
            });
    }

    public getOpenIdConfiguration(): Observable<OpenIdConfig> {
        return this.http.get<any>(`/api/life/adviser/openid/configuration`);
    }
    configuresso(oidcConfig: OpenIdConfig) {
        this.oauthService.configure(Object.assign({
            responseType: 'code',
            showDebugInformation: true,
            clearHashAfterLogin: false,
            requireHttps: false,
            strictDiscoveryDocumentValidation: false
        }, { ...oidcConfig }))

        this.oauthService.setupAutomaticSilentRefresh();

        this.oauthService.loadDiscoveryDocument()
        let promise;
        if (!this.oauthService.loginUrl) {
            promise = this.oauthService.loadDiscoveryDocument();
        } else {
            promise = new Promise((resolve, reject) => {
                resolve(null);
            });
        }
        this.oauthService.events.subscribe(event => {
            this.authenticatedSubject.next(this.oauthService.hasValidAccessToken());
            if (event instanceof OAuthSuccessEvent && event.type === 'token_received') {
                this.accessTokenSubject.next(this.oauthService.getAccessToken());
            } else if (event instanceof OAuthErrorEvent) {
            }
        });
        promise
            .then(() => this.oauthService.tryLogin())

            .then(() => {
                this.initialisedSubject.next(true);

                if (this.oauthService.hasValidAccessToken()) {
                    if (this.postLoginRedirect) {
                        this.router.navigateByUrl(this.postLoginRedirect);
                        this.postLoginRedirect = null;
                    } else if (this.oauthService.state) {
                        this.router.navigateByUrl(decodeURIComponent(this.oauthService.state));
                    }
                }
            });
    }
    login(url: string) {

        this.oauthService.clearHashAfterLogin;
        this.oauthService.initLoginFlow(url);
        this.oauthService.clearHashAfterLogin;
    }

    requestLogin(requestedUrl?: string): void {
        this.postLoginRedirect = requestedUrl || this.router.url;
        this.oauthService.initLoginFlow(requestedUrl || this.router.url);
    }

    getAccessToken(): string {
        return this.oauthService.getAccessToken();
    }

}
export class OpenIdConfig {
    issuer: string;
    clientId: string;
    redirectUri: string;
    requireHttps: boolean;
    clearHashAfterLogin: boolean;
    strictDiscoveryDocumentValidation: boolean;
    scope: string
}
