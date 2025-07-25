import { Routes } from '@angular/router';
import { TableListComponent } from '../../table-list/table-list.component';
import { ItemFormComponent } from '../../item-form/item-form.component';

export const MonedasRoutes: Routes = [
    { 
      path: 'monedas',      component: TableListComponent, data: {
        title: 'Monedas',
        url: '/api/v1/valrep/coin',
        tableId: 'monedas',
        tableInfo: [
          { headerName: 'Codigo', key: 'cmoneda', primary_key: true },
          { headerName: 'Nombre de la Moneda', key: 'xdescripcion' },
          { headerName: 'Código de la Moneda', key: 'xmoneda' },
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'monedas/create',   component: ItemFormComponent, data: {
        title: 'Crear Nueva Moneda',
        mode: 'create',
        mainUrl: '/api/v1/maestros/moneda',
        createUrl: '/api/v1/monedas/create',
        formId: 'create_moneda',
        fields: [
          {
            fieldName: 'Nombre de la Moneda', class: 'col-md-6',
            type: 'text',
            key: 'xdescripcion',
            bdType: 'text'
          },
          {
            fieldName: 'Codigo de la Moneda', class: 'col-md-2',
            type: 'text', 
            key: 'xmoneda',
            bdType: 'text'
          }
        ]
      } 
    },
    { 
      path: 'monedas/info/:id',   component: ItemFormComponent, data: {
        title: 'Información de la Moneda',
        mode: 'info',
        mainUrl: '/api/v1/maestros/moneda/',
        editUrl: '/api/v1/monedas/edit/',
        formId: 'edit_moneda',
        disableUrl: '/api/v1/monedas/disable/',
        fields: [
          {
            fieldName: 'Nombre de la Moneda', class: 'col-md-6',
            type: 'text',
            key: 'xdescripcion',
            bdType: 'text'
          },
          {
            fieldName: 'Codigo de la Moneda', class: 'col-md-2',
            type: 'text', 
            key: 'xmoneda',
            bdType: 'text'
          }
        ]
      } 
    },
    
];
