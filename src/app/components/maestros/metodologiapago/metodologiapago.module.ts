import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MetodologiapagoRoutes } from './metodologiapago-routing';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MetodologiapagoRoutes),
    NgbModule,
    ToastrModule.forRoot()
  ],
  declarations: []
})
export class MetodologiapagoModule { }
