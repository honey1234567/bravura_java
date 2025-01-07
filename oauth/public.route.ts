import { PasswordResetComponent } from './reset.password.component';
import { RemindUsernameComponent } from './remind.username.component';
import { TechsComponent } from './techs';
import { AuthGuard } from '../common/auth.guard';

export const publicRoutes: Routes = [
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'get-quote',
		canActivate: [AuthGuard],
		loadChildren: () => import('./quote').then(m => m.QuoteModule),
	},
	{
		path: 'reset-password',
		component: PasswordResetComponent,
		data: {
			options: {
				heading: 'reset.password.heading'
			}
		}
