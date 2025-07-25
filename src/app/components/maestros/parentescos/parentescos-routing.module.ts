import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from '../../table-list/table-list.component';
import { ItemFormComponent } from '../../item-form/item-form.component';

export const ParentescosRoutes: Routes = [
  { 
    path: 'parentescos',      component: TableListComponent, data: {
      title: 'Parentescos',
      url: '/api/v1/parentescos/search',
      tableId: 'parentescos',
      tableInfo: [
        { headerName: 'Parentesco', key: 'cparentesco', primary_key: true },
        { headerName: 'Descripción', key: 'xparentesco', primary_key: true },
        { headerName: 'País', key: 'cpais' },
      ],
      extraInfo: [
        {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
        // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
      ]
    }
  },
  { 
    path: 'parentesco/create',   component: ItemFormComponent, data: {
      title: 'Crear Nuevo Parentesco',
      mode: 'create',
      mainUrl: '/api/v1/maestros/parentescos',
      createUrl: '/api/v1/parentescos/create',
      formId: 'create_parentescos',
      fields: [      
        {
          fieldName: 'Descripción', class: 'col-md-4',
          type: 'text',
          key: 'xparentesco',
          bdType: 'text'
        },
        {
          fieldName: 'País', class: 'col-md-1',
          type: 'text',
          key: 'cpais',
          bdType: 'text'
        }
      ]
    } 
  },
  { 
    path: 'parentescos/info/:id',   component: ItemFormComponent, data: {
      title: 'Información de Parentescos',
      mode: 'info',
      mainUrl: '/api/v1/parentescos/get/',
      editUrl: '/api/v1/parentescos/edit/',
      formId: 'edit_parentescos',
      disableUrl: '/api/v1/parentescos/disable/',
      fields: [      
        {
          fieldName: 'Descripción', class: 'col-md-4',
          type: 'text',
          key: 'xparentesco',
          bdType: 'text'
        },
        {
          fieldName: 'País', class: 'col-md-1',
          type: 'text',
          key: 'cpais',
          bdType: 'text'
        }
      ]
    } 
  },
  
];
