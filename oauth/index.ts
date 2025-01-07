import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, AuthUser, SystemConfig } from './auth.service';
import { AuthGuard, PermissionBasedRoute } from './auth.guard';
import { LoginComponent } from './login.component';
import { LogoutComponent } from './logout.component';
import { ChangePasswordComponent } from './change.password.component';
import { PermissionsPipe } from './permissions.pipe';
import { IntegrationModule } from '../integration';

import { AuthGuard as AuthGuard1 } from '../auth.guard';
import { OAuthModule } from 'angular-oauth2-oidc';
@NgModule({
	imports: [
		NgCommonModule,
		FormsModule,
		IntegrationModule,
		TranslateModule,
		RouterModule
		RouterModule,
		OAuthModule.forRoot(
		),
	],
	declarations: [LoginComponent, LogoutComponent, ChangePasswordComponent, PermissionsPipe],
	exports: [PermissionsPipe]
})
export class AuthModule {
	static forRoot(): ModuleWithProviders<AuthModule> {
		return {
			ngModule: AuthModule,
			providers: [AuthService, AuthGuard]
			providers: [AuthService, AuthGuard, AuthGuard1
			]
		};
	}
}

export {
	LoginComponent,
	LogoutComponent,
	AuthService,
	AuthGuard,
	PermissionBasedRoute,
	AuthUser,
	ChangePasswordComponent,
	SystemConfig
	SystemConfig,
	AuthGuard1
};

export { CURRENT_USER, userProvider, RemindUserNameDetails, PasswordResetDetails } from './auth.service';
