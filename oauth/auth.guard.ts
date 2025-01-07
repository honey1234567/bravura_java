import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';



@Injectable()
export class AuthGuard implements CanActivate {
    private authenticated: boolean;
    constructor(private router: Router, private authService: AuthService) {
        this.authService.authenticated$.subscribe(authenticated => (this.authenticated = authenticated));
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        // console.log(state.url, route)

        const isIscResume: boolean = route.queryParams?.isIscResume;
        return this.authService.initialised$.pipe(
            filter(initialised => initialised),
            tap(() => this.authenticated || (isIscResume && this.authService.login(state.url))),
            map(() => this.authenticated || isIscResume)
        );
    }
}
