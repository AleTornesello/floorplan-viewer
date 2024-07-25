import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './skeleton/presentation/widgets/default-layout/default-layout.component';
import { LibraryPageComponent } from './library/presentation/pages/library-page/library-page.component';

export enum MsjRoute {
  LOGIN = 'login',
  REGISTER = 'register',
}

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
  },
];
