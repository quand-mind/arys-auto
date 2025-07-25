import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniasRoutes } from './companias-routing.module';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(CompaniasRoutes),
    NgbModule,
    ToastrModule.forRoot()
  ]
})
export class CompaniasModule { }
