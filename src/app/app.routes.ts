import {Routes} from '@angular/router';
import {LoginPageComponent} from './auth/pages/login-page/login-page.component';
import {EmptyLayoutComponent} from './skeleton/components/empty-layout/empty-layout.component';
import {RegisterPageComponent} from './auth/pages/register-page/register-page.component';
import {VerifyEmailPageComponent} from "./auth/pages/verify-email-page/verify-email-page.component";
import {BuildingsPageComponent} from "./building/pages/building-page/buildings-page.component";
import {DefaultLayoutComponent} from "./skeleton/components/default-layout/default-layout.component";

export enum MsjRoute {
  ADMIN = 'admin',
  BUILDINGS = 'buildings',
  AUTH = 'auth',
  LOGIN = 'login',
  REGISTER = 'register',
  VERIFY_EMAIL = 'verify-email',

}

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: MsjRoute.ADMIN,
        children: [
          {
            path: '',
            redirectTo: '/admin/buildings',
            pathMatch: 'full',
          },
          {
            path: MsjRoute.BUILDINGS,
            component: DefaultLayoutComponent,
            children: [
              {
                path: '',
                component: BuildingsPageComponent,
              }
            ]
          },
          {
            path: MsjRoute.AUTH,
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
        ]
      },
    ]
  },

];
