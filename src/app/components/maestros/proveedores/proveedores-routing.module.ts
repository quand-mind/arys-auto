import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from '../../table-list/table-list.component';
import { ItemFormComponent } from '../../item-form/item-form.component';

export const ProveedoresRoutes: Routes = [
  { 
    path: 'proveedores',      component: TableListComponent, data: {
      title: 'Proveedores',
      url: '/api/v1/proveedores/search',
      tableId: 'proveedores',
      tableInfo: [
        { headerName: 'Codigo', key: 'cproveedor', primary_key: true },
        { headerName: 'Nombre del Proveedor', key: 'xnombre' },
        // { headerName: 'Dirección', key: 'xdireccion' },
        { headerName: 'Doc. Identidad', key: 'xdocidentidad' },
        // { headerName: 'Correo', key: 'xcorreo' },
        { headerName: 'Teléfono Cel.', key: 'xtelefonocelular' },    
      ],
      extraInfo: [
        {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
      ]
    }
  },
  { 
    path: 'proveedores/create',   component: ItemFormComponent, data: {
      title: 'Crear Nuevo Proveedor',
      mode: 'create',
      mainUrl: '/api/v1/maestros/proveedores',
      createUrl: '/api/v1/proveedores/create',
      formId: 'create_proveedores',
      fields: [
      
        {
          fieldName: 'Nombre del Proveedor', class: 'col-md-6',
          type: 'text',
          key: 'xnombre',
          bdType: 'text'
        },
        {
          fieldName: 'Dirección', class: 'col-md-6',
          type: 'text',
          key: 'xdireccion',
          bdType: 'text'
        },
        {
          fieldName: 'Doc. de Identidad', class: 'col-md-3',
          type: 'text',
          key: 'xdocidentidad',
          bdType: 'text'
        }, 
        { 
          fieldName: 'País', class: 'col-md-3',
          type: 'select',
          url: '/api/v1/maestros/paises',
          binding_change_fields: ['cestado', 'cbanco'],
          change_fields: ['cestado', 'cciudad'],
          key: 'cpais',
          bdType: 'number'
        },
        {
          fieldName: 'Estado', class: 'col-md-3',
          type: 'select',
          key: 'cestado',
          url_id: 'cpais',
          binding_change_fields: ['cciudad'],
          change_fields: ['cciudad'],
          url: '/api/v1/maestros/estados',
          bdType: 'number'
        },
        {
          fieldName: 'Ciudad', class: 'col-md-3',
          type: 'select',
          key: 'cciudad',
          url_id: 'cestado',
          url: '/api/v1/maestros/ciudades',
          bdType: 'text'
        },
        {
          fieldName: 'Correo', class: 'col-md-6',
          type: 'email',
          key: 'xcorreo',
          bdType: 'text'
        },
        {
          fieldName: 'Teléfono Celular', class: 'col-md-3',
          type: 'text',
          key: 'xtelefonocelular',
          bdType: 'text'
        },
        {
          fieldName: 'Teléfono', class: 'col-md-3',
          type: 'text',
          key: 'xtelefono',
          bdType: 'text'
        },
        {
          fieldName: 'Observación', class: 'col-md-12',
          type: 'text',
          key: 'xobservacion',
          bdType: 'text'
        },
        {
          fieldName: 'Compañía', class: 'col-md-6',
          type: 'select',
          defaultValue: 1,
          url: '/api/v1/maestros/companias',
          binding_change_fields: ['ctiposervicio'],
          key: 'ccompania',
          bdType: 'number'
        },
        {
          fieldName: 'Estatus del Proveedor', class: 'col-md-4',
          type: 'select',
          url: '/api/v1/maestros/estatuses',
          key: 'cestatusgeneral',
          bdType: 'number'
        },
        {
          fieldName: 'Servicios', class: 'col-md-12',
          type: 'multiple-select',
          key_form: 'cservicio',
          key: 'ctiposervicio',
          added_data_key: 'ctiposervicio',
          url: '/api/v1/services/getTypeServices',
          url_id: 'ccompania',
          bdType: 'extern'
        },
        {
          fieldName: 'Bancos',
          modalTitle: 'Informacion del Banco',
          class: 'col-md-12',
          type: 'multiple-select',
          key: 'cbanco',
          added_data_key: 'cbancos',
          url: '/api/v1/bancos/getBancos',
          url_id: 'cpais',
          other_info: true,
          other_values: [
            {
              text: 'Tipo de Cuenta',
              type: 'select',
              key: 'ctipocuentabancaria',
              value: '',
              url: '/api/v1/maestros/getCuentasMaestros',
              class: 'col-md-6'
            },
            {
              text: 'Número de Cuenta',
              type: 'text',
              key: 'xnumerocuenta',
              value: '',
              class: 'col-md-6'
            }
          ],
          bdType: 'extern'
        }
      ]
    } 
  },
  { 
    path: 'proveedores/info/:id',   component: ItemFormComponent, data: {
      title: 'Información del Proveedor',
      mode: 'info',
      mainUrl: '/api/v1/proveedores/get/',
      editUrl: '/api/v1/proveedores/edit/',
      formId: 'edit_proveedores',
      disableUrl: '/api/v1/proveedores/disable/',
      fields: [
      
        {
          fieldName: 'Nombre del Proveedor', class: 'col-md-6',
          type: 'text',
          key: 'xnombre',
          bdType: 'text'
        },
        {
          fieldName: 'Dirección', class: 'col-md-6',
          type: 'text',
          key: 'xdireccion',
          bdType: 'text'
        },
        {
          fieldName: 'Doc. de Identidad', class: 'col-md-3',
          type: 'text',
          key: 'xdocidentidad',
          bdType: 'text'
        }, 
        { 
          fieldName: 'País', class: 'col-md-3',
          type: 'select',
          url: '/api/v1/maestros/paises',
          binding_change_fields: ['cestado'],
          change_fields: ['cestado', 'cciudad'],
          key: 'cpais',
          bdType: 'number'
        },
        {
          fieldName: 'Estado', class: 'col-md-3',
          type: 'select',
          key: 'cestado',
          url_id: 'cpais',
          binding_change_fields: ['cciudad'],
          change_fields: ['cciudad'],
          url: '/api/v1/maestros/estados',
          bdType: 'number'
        },
        {
          fieldName: 'Ciudad', class: 'col-md-3',
          type: 'select',
          key: 'cciudad',
          url_id: 'cestado',
          url: '/api/v1/maestros/ciudades',
          bdType: 'text'
        },
        {
          fieldName: 'Correo', class: 'col-md-6',
          type: 'text',
          key: 'xcorreo',
          bdType: 'text'
        },
        {
          fieldName: 'Teléfono Celular', class: 'col-md-3',
          type: 'text',
          key: 'xtelefonocelular',
          bdType: 'text'
        },
        {
          fieldName: 'Teléfono', class: 'col-md-3',
          type: 'text',
          key: 'xtelefono',
          bdType: 'text'
        },
        {
          fieldName: 'Observación', class: 'col-md-12',
          type: 'text',
          key: 'xobservacion',
          bdType: 'text'
        },
        {
          fieldName: 'Compañía', class: 'col-md-6',
          type: 'select',
          url: '/api/v1/maestros/companias',
          key: 'ccompania',
          bdType: 'number',
        },
        {
          fieldName: 'Estatus del Proveedor', class: 'col-md-4',
          type: 'select',
          url: '/api/v1/maestros/estatuses',
          key: 'cestatusgeneral',
          bdType: 'number'
        },
        {
          fieldName: 'Servicios', class: 'col-md-12',
          type: 'multiple-select',
          url: '/api/v1/services/getTypeServices',
          key_form: 'cservicio',
          added_data_key: 'ctiposervicio',
          url_id: 'ccompania',
          key: 'ctiposervicio',
          bdType: 'extern'
        },
        {
          fieldName: 'Bancos',
          modalTitle: 'Informacion del Banco',
          class: 'col-md-12',
          type: 'multiple-select',
          key: 'cbanco',
          added_data_key: 'cbancos',
          url: '/api/v1/bancos/getBancos',
          url_id: 'cpais',
          other_info: true,
          other_values: [
            {
              text: 'Tipo de Cuenta',
              type: 'select',
              key: 'ctipocuentabancaria',
              value: '',
              url: '/api/v1/maestros/getCuentasMaestros',
              class: 'col-md-6'
            },
            {
              text: 'Número de Cuenta',
              type: 'text',
              key: 'xnumerocuenta',
              value: '',
              class: 'col-md-6'
            }
          ],
          bdType: 'extern'
        }
      ]
    } 
  },
  
];
