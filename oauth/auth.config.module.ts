import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AuthService } from '../../common/auth.service';

export function init_app(authService: AuthService) {
	return () => authService.initialise();
}

@NgModule({
	imports: [
		HttpClientModule,
		OAuthModule.forRoot({
			resourceServer: {
				sendAccessToken: true,
				customUrlValidation: (url: string): boolean => url && url.indexOf('/api') >= 0
			}
		})
	],
	providers: [
		AuthService,
		{
			provide: APP_INITIALIZER,
			useFactory: init_app,
			deps: [AuthService],
			multi: true
		}
	]
})
export class AuthConfigModule { }
