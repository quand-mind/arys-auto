import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from '../../table-list/table-list.component';
import { ItemFormComponent } from '../../item-form/item-form.component';

export const PropietariosRoutes: Routes = [
  { 
    path: 'propietarios',      component: TableListComponent, data: {
      title: 'Propietarios',
      url: '/api/v1/propietarios/search',
      noCreate: true,
      tableId: 'propietarios',
      tableInfo: [
        { headerName: 'Propietario', key: 'cpropietario', primary_key: true },
        { headerName: 'Nombre', key: 'xnombre' },
        { headerName: 'Apellido', key: 'xapellido' },
        { headerName: 'Estado Civil', key: 'cestadocivil' },
        { headerName: 'Sexo', key: 'csexo' },
        { headerName: 'Fecha Nacimiento', key: 'fnacimiento' },
        { headerName: 'Tipo Documento', key: 'icedula' },
        { headerName: 'Cedula/Rif', key: 'xcedula' },      
      ],
      extraInfo: [
        {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
      ]
    }
  },

  { 
    path: 'propietarios/info/:id',   component: ItemFormComponent, data: {
      title: 'Información del Propietario',
      mode: 'info',
      mainUrl: '/api/v1/propietarios/get/',
      editUrl: '/api/v1/propietarios/edit/',
      formId: 'edit_propietarios',
      disableUrl: '/api/v1/propietarios/disable/',
      fields: [
      
        {
          fieldName: 'Nombres', class: 'col-md-6',
          type: 'text',
          key: 'xnombre',
          bdType: 'text'
        },
        {
          fieldName: 'Apellidos', class: 'col-md-6' ,
          type: 'text',
          key: 'xapellido',
          bdType: 'text'
        },
        {
          fieldName: 'Estado Civil', class: 'col-md-2',
          type: 'text',
          key: 'cestadocivil',
          bdType: 'text'
        },
        {
          fieldName: 'Sexo', class: 'col-md-2',
          type: 'text',
          key: 'csexo',
          bdType: 'text'
        }, 
        {
          fieldName: 'Fecha Nacimiento', class: 'col-md-3',
          type: 'text',
          key: 'fnacimiento',
          bdType: 'text'
        },
        {
          fieldName: 'Tipo Documento', class: 'col-md-2',
          type: 'text',
          key: 'icedula',
          bdType: 'text'
        },
        {
          fieldName: 'Cedula/Rif', class: 'col-md-3',
          type: 'text',
          key: 'xcedula',
          bdType: 'text'
        },
        {
          fieldName: 'Dirección', class: 'col-md-12',
          type: 'text',
          key: 'xdireccion',
          bdType: 'text'
        },
        {
          fieldName: 'Correo', class: 'col-md-4',
          type: 'text',
          key: 'xemail',
          bdType: 'text'
        },       
      ]
    } 
  },
  
];
