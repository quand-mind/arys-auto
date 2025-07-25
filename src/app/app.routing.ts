import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ClubLayoutComponent } from './layouts/club-layout/club-layout.component';
 import { LoginComponent } from '../app/auth/login/login.component';

const routes: Routes =[
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: '',
        loadChildren: () => import('./auth/auth.module').then(x=>x.AuthModule)
      },
    ]
  },
  {
    path: 'admin',
    children: [
      {
        path: '',
        loadChildren: () => 
          import('./layouts/admin-layout/admin-layout.module').then(x=>x.AdminLayoutModule)
      },
    ]
  },
  
  {
    path: 'club',
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/club-layout/club-layout.module').then(x=>x.ClubLayoutModule)
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'auth/login',
    component: LoginComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
