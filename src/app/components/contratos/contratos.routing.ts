import { Routes } from '@angular/router';
import { TableListComponent } from '../table-list/table-list.component';
import { ItemFormComponent } from '../item-form/item-form.component';
import { ContractComponent } from '../contratos/contract/contract.component';
import { MembershipComponent } from '../contratos/contract/membership/membership.component';

export const ContratosRoutes: Routes = [
    { 
      path: 'contratos',      component: ContractComponent, data: {
        title: 'Contratos',
        url: '/api/v1/contracts/search',
        tableId: 'contratos',
      }
    },
    { 
      path: 'contratos/create/membership',     component: MembershipComponent, data: {
        type: 'membership',
        title: 'Crear Afiliación',
        formId: 'contratos_crear_membresia',
        mode: 'create',
        mainUrl: 'api/contrato'
      }
    },
    { 
      path: 'contratos/create/corporate',     component: MembershipComponent, data: {
        type: 'corporate',
        title: 'Crear Afiliación',
        formId: 'contratos_crear_corporativos',
        mode: 'create',
        mainUrl: 'api/contrato'
      }
    },
    { 
      path: 'contratos/:id',   component: ItemFormComponent, data: {
        title: 'Contrato',
        mode: 'info',
        mainUrl: 'api/contrato',
        disableUrl: '/disable'
      } 
    },
    {
      path: 'contratos/**',
      redirectTo: "contratos"
    }
];
