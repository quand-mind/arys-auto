import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { ClubLayoutRoutes } from './club-layout.routing';
import { OrdenesComponent } from '../../components/ordenes/ordenes.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ClubLayoutRoutes),
    FormsModule,
    ChartsModule,
    NgbModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    OrdenesComponent
  ]
})

export class ClubLayoutModule {}
