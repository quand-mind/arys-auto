import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from '../../table-list/table-list.component';
import { ItemFormComponent } from '../../item-form/item-form.component';

export const VehiculosRoutes: Routes = [
  { 
    path: 'vehiculos',      component: TableListComponent, data: {
      title: 'Vehiculos',
      url: '/api/v1/vehiculos/search',
      noCreate: true,
      tableId: 'vehiculos',
      tableInfo: [
        { headerName: 'vehiculo', key: 'cvehiculopropietario', primary_key: true },
        { headerName: 'Compañía', key: 'ccompania' },
        { headerName: 'Placa', key: 'xplaca' },
        { headerName: 'Estado Civil', key: 'cestadocivil' },
        { headerName: 'Año', key: 'fano' },
        { headerName: 'Color', key: 'xcolor' },     
      ],
      extraInfo: [
        {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
      ]
    }
  },

  { 
    path: 'vehiculos/info/:id',   component: ItemFormComponent, data: {
      title: 'Información del Vehículo',
      mode: 'info',
      mainUrl: '/api/v1/vehiculos/get/',
      editUrl: '/api/v1/vehiculos/edit/',
      formId: 'edit_vehiculos',
      disableUrl: '/api/v1/vehiculos/disable/',
      fields: [
      
        {
          fieldName: 'Compañía', class: 'col-md-6',
          type: 'text',
          key: 'ccompania',
          bdType: 'text'
        },
        {
          fieldName: 'Marca', class: 'col-md-6' ,
          type: 'text',
          key: 'cmarca',
          bdType: 'text'
        },
        {
          fieldName: 'Descripcion Marca', class: 'col-md-2',
          type: 'text',
          key: 'xmarca',
          bdType: 'text'
        },
        {
          fieldName: 'Modelo', class: 'col-md-2',
          type: 'text',
          key: 'cmodelo',
          bdType: 'text'
        }, 
        {
          fieldName: 'Descripcion Modelo', class: 'col-md-3',
          type: 'text',
          key: 'xmodelo',
          bdType: 'text'
        },
        {
          fieldName: 'Version', class: 'col-md-2',
          type: 'text',
          key: 'cversion',
          bdType: 'text'
        },
        {
          fieldName: 'Descripcion Versionf', class: 'col-md-3',
          type: 'text',
          key: 'xversion',
          bdType: 'text'
        },
        {
          fieldName: 'Placa', class: 'col-md-12',
          type: 'text',
          key: 'xplaca',
          bdType: 'text'
        },
        {
          fieldName: 'Año', class: 'col-md-4',
          type: 'text',
          key: 'fano',
          bdType: 'text'
        }, 
        {
          fieldName: 'Serial Carrocería', class: 'col-md-4',
          type: 'text',
          key: 'xserialcarroceria',
          bdType: 'text'
        }, 
        {
          fieldName: 'Serial Motor', class: 'col-md-4',
          type: 'text',
          key: 'xserialmotor',
          bdType: 'text'
        }, 
        {
          fieldName: 'País', class: 'col-md-4',
          type: 'text',
          key: 'cpais',
          bdType: 'text'
        },
        {
          fieldName: 'Moneda', class: 'col-md-4',
          type: 'text',
          key: 'cmoneda',
          bdType: 'text'
        },   
        {
          fieldName: 'Color', class: 'col-md-4',
          type: 'text',
          key: 'xcolor',
          bdType: 'text'
        }       
      ]
    } 
  },
  
];
