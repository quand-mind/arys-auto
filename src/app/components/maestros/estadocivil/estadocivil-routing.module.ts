import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from '../../table-list/table-list.component';
import { ItemFormComponent } from '../../item-form/item-form.component';

export const EstadocivilRoutes: Routes = [
  { 
    path: 'estadocivil',      component: TableListComponent, data: {
      title: 'Estado Civil',
      url: '/api/v1/estadocivil/search',
      tableId: 'estadocivil',
      tableInfo: [
        { headerName: 'Estado Civil', key: 'cestadocivil', primary_key: true },
        { headerName: 'Descripción', key: 'xestadocivil', primary_key: true },
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
      title: 'Crear Nuevo Estado Civil',
      mode: 'create',
      mainUrl: '/api/v1/maestros/estadocivil',
      createUrl: '/api/v1/estadocivil/create',
      formId: 'create_estadocivil',
      fields: [      
        {
          fieldName: 'Descripción', class: 'col-md-4',
          type: 'text',
          key: 'xestadocivil',
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
    path: 'estadocivil/info/:id',   component: ItemFormComponent, data: {
      title: 'Información de Estado Civil',
      mode: 'info',
      mainUrl: '/api/v1/estadocivil/get/',
      editUrl: '/api/v1/estadocivil/edit/',
      formId: 'edit_estadocivil',
      disableUrl: '/api/v1/estadocivil/disable/',
      fields: [      
        {
          fieldName: 'Descripción', class: 'col-md-4',
          type: 'text',
          key: 'xestadocivil',
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
