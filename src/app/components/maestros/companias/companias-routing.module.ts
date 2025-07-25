import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from '../../table-list/table-list.component';
import { ItemFormComponent } from '../../item-form/item-form.component';

export const CompaniasRoutes: Routes = [
  { 
    path: 'companias',      component: TableListComponent, data: {
      title: 'Companias',
      url: '/api/v1/companias/search',
      tableId: 'Companias',
      tableInfo: [
        { headerName: 'Compañía', key: 'ccompania', primary_key: true },
        { headerName: 'Nombre de la Compañía', key: 'xcompania' },
        { headerName: 'Rif', key: 'xrif' },
        { headerName: 'Págína Web', key: 'xpaginaweb' },
        { headerName: 'Teléfono', key: 'xtelefono' },     
      ],
      extraInfo: [
        {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
      ]
    }
  },
  { 
    path: 'companias/create',   component: ItemFormComponent, data: {
      title: 'Crear Nueva Compañía',
      mode: 'create',
      mainUrl: '/api/v1/maestros/companias',
      createUrl: '/api/v1/companias/create',
      formId: 'create_companias',
      fields: [      
        {
          fieldName: 'Descripción', class: 'col-md-8',
          type: 'text',
          key: 'xcompania',
          bdType: 'text'
        },
        {
          fieldName: 'Rif', class: 'col-md-4',
          type: 'text',
          key: 'xrif',
          bdType: 'text'
        },
        {
          fieldName: 'Página Web', class: 'col-md-4',
          type: 'text',
          key: 'xpaginaweb',
          bdType: 'text'
        }, 
        {
          fieldName: 'Dirección', class: 'col-md-8',
          type: 'text',
          key: 'xdireccionfiscal',
          bdType: 'text'
        },
        {
          fieldName: 'Representante Legal', class: 'col-md-6',
          type: 'text',
          key: 'xrepresentantelegal',
          bdType: 'text'
        },
        {
          fieldName: 'Cédula Representante', class: 'col-md-6',
          type: 'text',
          key: 'xdocidentidad',
          bdType: 'text'
        },
        {
          fieldName: 'Telefono', class: 'col-md-6',
          type: 'text',
          key: 'xtelefono',
          bdType: 'text'
        }
      ]
    } 
  },
  { 
    path: 'companias/info/:id',   component: ItemFormComponent, data: {
      title: 'Información de la Compañía',
      mode: 'info',
      mainUrl: '/api/v1/companias/get/',
      editUrl: '/api/v1/companias/edit/',
      formId: 'edit_companias',
      disableUrl: '/api/v1/companias/disable/',
      fields: [     
        {
          fieldName: 'Descripción', class: 'col-md-8',
          type: 'text',
          key: 'xcompania',
          bdType: 'text'
        },
        {
          fieldName: 'Rif', class: 'col-md-4',
          type: 'text',
          key: 'xrif',
          bdType: 'text'
        },
        {
          fieldName: 'Página Web', class: 'col-md-4',
          type: 'text',
          key: 'xpaginaweb',
          bdType: 'text'
        }, 
        {
          fieldName: 'Dirección', class: 'col-md-8',
          type: 'text',
          key: 'xdireccionfiscal',
          bdType: 'text'
        },
        {
          fieldName: 'Representante Legal', class: 'col-md-6',
          type: 'text',
          key: 'xrepresentantelegal',
          bdType: 'text'
        },
        {
          fieldName: 'Cédula Representante', class: 'col-md-6',
          type: 'text',
          key: 'xdocidentidad',
          bdType: 'text'
        },
        {
          fieldName: 'Teléfono', class: 'col-md-6',
          type: 'text',
          key: 'xtelefono',
          bdType: 'text'
        }
      ]
    } 
  }, 
];
