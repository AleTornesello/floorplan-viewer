import {Routes} from '@angular/router';
import {LoginPageComponent} from './auth/pages/login-page/login-page.component';
import {EmptyLayoutComponent} from './skeleton/components/empty-layout/empty-layout.component';
import {RegisterPageComponent} from './auth/pages/register-page/register-page.component';
import {VerifyEmailPageComponent} from "./auth/pages/verify-email-page/verify-email-page.component";

export enum MsjRoute {
  LOGIN = 'login',
  REGISTER = 'register',
  VERIFY_EMAIL = 'verify-email',
}

export const routes: Routes = [
  {
    path: '',
    component: EmptyLayoutComponent,
    children: [
      {
        path: MsjRoute.LOGIN,
        component: LoginPageComponent,
      },
      {
        path: MsjRoute.REGISTER,
        component: RegisterPageComponent,
      },
      {
        path: MsjRoute.VERIFY_EMAIL,
        component: VerifyEmailPageComponent,
      },
    ],
  },
];
