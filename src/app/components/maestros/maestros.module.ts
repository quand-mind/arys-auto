import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaestrosRoutingModule } from './maestros-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaestrosComponent } from './maestros.component'
import { MatButtonModule } from '@angular/material/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    MaestrosComponent
  ],
  imports: [
    CommonModule,
    MaestrosRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    MatButtonModule
  ]
})
export class MaestrosModule { }
