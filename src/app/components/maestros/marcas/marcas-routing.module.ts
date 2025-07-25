import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from '../../table-list/table-list.component';
import { ItemFormComponent } from '../../item-form/item-form.component';

export const MarcasRoutes: Routes = [
  { 
    path: 'marcas',      component: TableListComponent, data: {
      title: 'Marcas',
      url: '/api/v1/marcas/search',
      noCreate: true,
      tableId: 'Marcas',
      tableInfo: [
        { headerName: 'id', key: 'id', primary_key: true },
        { headerName: 'Codigo Marca', key: 'cmarca' },
        { headerName: 'Marca', key: 'xmarca' },
        { headerName: 'Codigo Modelo', key: 'cmodelo' },
        { headerName: 'Modelo', key: 'xmodelo' },    
        { headerName: 'Codigo Version', key: 'cversion' },
        { headerName: 'Version', key: 'xversion' },
        { headerName: 'Transmision', key: 'xtrans' }, 
        { headerName: 'Motor', key: 'xmotor' }, 
        { headerName: 'Año', key: 'qano' },  
        { headerName: 'No Pasajero', key: 'npasajero' },  
      ],
      extraInfo: [
        {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
      ]
    }
  },
  { 
    path: 'marcas/create',   component: ItemFormComponent, data: {
      title: 'Crear Nueva Marca',
      mode: 'create',
      mainUrl: '/api/v1/maestros/marcas',
      createUrl: '/api/v1/marcas/create',
      formId: 'create_marcas',
      fields: [      
        {
          fieldName: 'Codigo Marca', class: 'col-md-2',
          type: 'text',
          key: 'cmarca',
          bdType: 'text'
        },
        {
          fieldName: 'Marca', class: 'col-md-4',
          type: 'text',
          key: 'xmarca',
          bdType: 'text'
        },
        {
          fieldName: 'Codigo Modelo', class: 'col-md-2',
          type: 'text',
          key: 'cmodelo',
          bdType: 'text'
        }, 
        {
          fieldName: 'Modelo', class: 'col-md-4',
          type: 'text',
          key: 'xmodelo',
          bdType: 'text'
        },
        {
          fieldName: 'Codigo Version', class: 'col-md-2',
          type: 'text',
          key: 'cversion',
          bdType: 'text'
        },
        {
          fieldName: 'Version', class: 'col-md-4',
          type: 'text',
          key: 'xversion',
          bdType: 'text'
        },
        {
          fieldName: 'Transmisión', class: 'col-md-6',
          type: 'text',
          key: 'xtrans',
          bdType: 'text'
        },
        {
          fieldName: 'Motor', class: 'col-md-6',
          type: 'text',
          key: 'xmotor',
          bdType: 'text'
        },
        {
          fieldName: 'Año', class: 'col-md-3',
          type: 'text',
          key: 'qano',
          bdType: 'text'
        },
        {
          fieldName: 'No. Pasajeros', class: 'col-md-3',
          type: 'text',
          key: 'npasajero',
          bdType: 'text'
        }
      ]
    } 
  },
  { 
    path: 'marcas/info/:id',   component: ItemFormComponent, data: {
      title: 'Información de Marcas, Modelos y Versiones',
      mode: 'info',
      mainUrl: '/api/v1/marcas/get/',
      editUrl: '/api/v1/marcas/edit/',
      formId: 'edit_marcas',
      disableUrl: '/api/v1/marcas/disable/',
      fields: [     
        {
          fieldName: 'Codigo Marca', class: 'col-md-2',
          type: 'text',
          key: 'cmarca',
          bdType: 'text'
        },
        {
          fieldName: 'Marca', class: 'col-md-4',
          type: 'text',
          key: 'xmarca',
          bdType: 'text'
        },
        {
          fieldName: 'Codigo Modelo', class: 'col-md-2',
          type: 'text',
          key: 'cmodelo',
          bdType: 'text'
        }, 
        {
          fieldName: 'Modelo', class: 'col-md-4',
          type: 'text',
          key: 'xmodelo',
          bdType: 'text'
        },
        {
          fieldName: 'Codigo Version', class: 'col-md-2',
          type: 'text',
          key: 'cversion',
          bdType: 'text'
        },
        {
          fieldName: 'Version', class: 'col-md-4',
          type: 'text',
          key: 'xversion',
          bdType: 'text'
        },
        {
          fieldName: 'Transmisión', class: 'col-md-6',
          type: 'text',
          key: 'xtrans',
          bdType: 'text'
        },
        {
          fieldName: 'Motor', class: 'col-md-6',
          type: 'text',
          key: 'xmotor',
          bdType: 'text'
        },
        {
          fieldName: 'Año', class: 'col-md-3',
          type: 'text',
          key: 'qano',
          bdType: 'text'
        },
        {
          fieldName: 'No. Pasajeros', class: 'col-md-3',
          type: 'text',
          key: 'npasajero',
          bdType: 'text'
        }
      ]
    } 
  }, 
];
