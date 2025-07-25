import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from '../../table-list/table-list.component';
import { ItemFormComponent } from '../../item-form/item-form.component';

export const BancosRoutes: Routes = [
  { 
    path: 'bancos',      component: TableListComponent, data: {
      title: 'Bancos',
      url: '/api/v1/bancos/search',
      tableId: 'bancos',
      tableInfo: [
        { headerName: 'Codigo', key: 'cbanco', primary_key: true },
        { headerName: 'Nombre del Banco', key: 'xbanco' },
        { headerName: 'Pais', key: 'cpais' },
      ],
      extraInfo: [
        {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
        // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
      ]
    }
  },
  { 
    path: 'bancos/create',   component: ItemFormComponent, data: {
      title: 'Crear Nuevo Banco',
      mode: 'create',
      mainUrl: '/api/v1/maestros/bancos',
      createUrl: '/api/v1/bancos/create',
      formId: 'create_bancos',
      fields: [     
        {
          fieldName: 'Nombre del Banco', class: 'col-md-8',
          type: 'text',
          key: 'xbanco',
          bdType: 'text'
        },
        { 
          fieldName: 'País', class: 'col-md-4',
          type: 'select',
          url: '/api/v1/maestros/paises',
          key: 'cpais',
          bdType: 'number'
        },
      ]
    } 
  },
  { 
    path: 'bancos/info/:id',   component: ItemFormComponent, data: {
      title: 'Información del Banco',
      mode: 'info',
      mainUrl: '/api/v1/bancos/get/',
      editUrl: '/api/v1/bancos/edit/',
      formId: 'edit_bancos',
      disableUrl: '/api/v1/bancos/disable/',
      fields: [      
        {
          fieldName: 'Nombre del Banco', class: 'col-md-8',
          type: 'text',
          key: 'xbanco',
          bdType: 'text'
        },
        { 
          fieldName: 'País', class: 'col-md-4',
          type: 'select',
          url: '/api/v1/maestros/paises',
          key: 'cpais',
          bdType: 'number'
        },
      ]
    } 
  },
  
];
