import {Routes} from '@angular/router';
import {LoginPageComponent} from './auth/pages/login-page/login-page.component';
import {EmptyLayoutComponent} from './skeleton/components/empty-layout/empty-layout.component';
import {RegisterPageComponent} from './auth/pages/register-page/register-page.component';
import {VerifyEmailPageComponent} from "./auth/pages/verify-email-page/verify-email-page.component";
import {BuildingsPageComponent} from "./building/pages/building-page/buildings-page.component";
import {DefaultLayoutComponent} from "./skeleton/components/default-layout/default-layout.component";
import {BuildingDetailPageComponent} from "./building/pages/building-detail-page/building-detail-page.component";
import {PublicLayoutComponent} from "./skeleton/components/public-layout/public-layout.component";
import {PublicFloorPlanPageComponent} from "./building/pages/public-floor-plan-page/public-floor-plan-page.component";

export enum FpRoute {
  ADMIN = 'admin',
  BUILDINGS = 'buildings',
  AUTH = 'auth',
  LOGIN = 'login',
  REGISTER = 'register',
  VERIFY_EMAIL = 'verify-email',
  NEW = 'new',
}

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: FpRoute.ADMIN,
        children: [
          {
            path: '',
            redirectTo: '/admin/buildings',
            pathMatch: 'full',
          },
          {
            path: FpRoute.BUILDINGS,
            component: DefaultLayoutComponent,
            children: [
              {
                path: '',
                component: BuildingsPageComponent,
              },
              {
                path: FpRoute.NEW,
                component: BuildingDetailPageComponent,
              },
              {
                path: ':id',
                component: BuildingDetailPageComponent,
              }
            ]
          },
          {
            path: FpRoute.AUTH,
            component: EmptyLayoutComponent,
            children: [
              {
                path: FpRoute.LOGIN,
                component: LoginPageComponent,
              },
              {
                path: FpRoute.REGISTER,
                component: RegisterPageComponent,
              },
              {
                path: FpRoute.VERIFY_EMAIL,
                component: VerifyEmailPageComponent,
              },
            ],
          },
        ]
      },
      {
        path: ':id',
        component: PublicLayoutComponent,
        children: [
          {
            path: '',
            component: PublicFloorPlanPageComponent,
          },
        ]
      }
    ]
  },

];
