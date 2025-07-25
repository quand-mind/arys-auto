import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from '../../table-list/table-list.component';
import { ItemFormComponent } from '../../item-form/item-form.component';

export const TipodocidentidadRoutes: Routes = [
  { 
    path: 'tipodocidentidad',      component: TableListComponent, data: {
      title: 'Tipo de Documento de Identidad',
      url: '/api/v1/tipodocidentidad/search',
      tableId: 'tipodocidentidad',
      tableInfo: [
        { headerName: 'Documento', key: 'ctipodocidentidad', primary_key: true },
        { headerName: 'Tipo', key: 'xtipodocidentidad', primary_key: true },
        { headerName: 'Descripci162n', key: 'xdescripcion', primary_key: true },   
        { headerName: 'País', key: 'cpais' },
      ],
      extraInfo: [
        {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
      ]
    }
  },
  { 
    path: 'tipodocidentidad/create',   component: ItemFormComponent, data: {
      title: 'Crear Nuevo Tipo de Documento Identidad',
      mode: 'create',
      mainUrl: '/api/v1/maestros/tipodocidentidad',
      createUrl: '/api/v1/tipodocidentidad/create',
      formId: 'create_tipodocidentidad',
      fields: [    
        {
          fieldName: 'Tipo', class: 'col-md-2',
          type: 'text',
          key: 'xtipodocidentidad',
          bdType: 'text'
        },             
        {
          fieldName: 'Descripción', class: 'col-md-8',
          type: 'text',
          key: 'xdescripcion',
          bdType: 'text'
        },
        {
          fieldName: 'País', class: 'col-md-2',
          type: 'text',
          key: 'cpais',
          bdType: 'text'
        }
      ]
    } 
  },
  { 
    path: 'tipodocidentidad/info/:id',   component: ItemFormComponent, data: {
      title: 'Información Tipo doc de Identidad',
      mode: 'info',
      mainUrl: '/api/v1/tipodocidentidad/get/',
      editUrl: '/api/v1/tipodocidentidad/edit/',
      formId: 'edit_tipodocidentidad',
      disableUrl: '/api/v1/tipodocidentidad/disable/',
      fields: [      
        {
          fieldName: 'Tipo', class: 'col-md-2',
          type: 'text',
          key: 'xtipodocidentidad',
          bdType: 'text'
        },             
        {
          fieldName: 'Descripción', class: 'col-md-8',
          type: 'text',
          key: 'xdescripcion',
          bdType: 'text'
        },
        {
          fieldName: 'País', class: 'col-md-2',
          type: 'text',
          key: 'cpais',
          bdType: 'text'
        }
      ]
    } 
  },
  
];
