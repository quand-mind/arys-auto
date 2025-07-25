import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlanesRoutes } from './planes.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PlanesRoutes),
    NgbModule,
    ToastrModule.forRoot()
  ],
  declarations: []
})
export class PlanesModule { }
