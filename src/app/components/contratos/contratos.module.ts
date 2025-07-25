import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { ContratosRoutes } from './contratos.routing';
import { ContractComponent } from './contract/contract.component';
import { MaterialExampleModule } from './../../../app/material.module'
import { ReactiveFormsModule } from '@angular/forms';
import { MembershipComponent } from './contract/membership/membership.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { StepOneComponent } from './contract/membership/step-one/step-one.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ContratosRoutes),
    NgbModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  declarations: [
  ]
})
export class ContratosModule { }
