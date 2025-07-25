import { Routes } from '@angular/router';
import { TableListComponent } from '../table-list/table-list.component';
import { ItemFormComponent } from '../item-form/item-form.component';

export const OrdenesRoutes: Routes = [
  { 
    path: 'ordenes',      component: TableListComponent, data: {
      title: 'Ordenes De Servicio',
      url: '/api/v1/orders/getOrdersByUser',
      idUser: true,
      tableId: 'orders',
      tableInfo: [
        { headerName: 'Orden', key: 'corden', primary_key: true },
        { headerName: 'Servicio', key: 'xservicio' },
        { headerName: 'Notificacion', key: 'cnotificacion' },
        { headerName: 'Fecha de Solicitud', key: 'fsolicitud' },
      ],
      extraInfo: [
        {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
        {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/orders/verCertificado/'}
      ]
    }
  },

];
