import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';

export const AuthRoutes: Routes = [
    { path: '', component: AuthLayoutComponent, children: [
      { 
        path: 'login', component: LoginComponent
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
    ]}
];
