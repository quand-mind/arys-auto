import { Routes } from '@angular/router';
import { TableListComponent } from '../table-list/table-list.component';
import { ItemFormComponent } from '../item-form/item-form.component';

export const PlanesRoutes: Routes = [
    { 
      path: 'planes',      component: TableListComponent, data: {
        title: 'Planes',
        url: '/api/v1/plan/search',
        tableId: 'planes',
        tableInfo: [
          { headerName: 'Codigo', key: 'id' },
          { headerName: 'Nombre del Plan', key: 'xplan' },
          { headerName: 'Costo', key: 'mcosto' },
        ],
        extraInfo: [
          {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
          // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
        ]
      }
    },
    { 
      path: 'planes/create',     component: ItemFormComponent, data: {
        title: 'Crear Plan',
        formId: 'planes_crear',
        mode: 'create',
        mainUrl: '/api/v1/plan',
        createUrl: '/api/v1/plan/create',
        fields: [
          {
            fieldName: 'Tipo del Plan', class: 'col-md-6',
            type: 'simple-select',
            form_control_value: {key: 'ccompania', value: '1'},
            values: [{text: 'Corporativo', value: '1'}, {text: 'Membresía Arys', value: '2'}], 
            key: 'ctipoplan',
            bdType: 'noDB'
            // url: 'api/tipoPlan'
          },
          {
            fieldName: 'Nombre del Plan', class: 'col-md-6',
            type: 'text', 
            key: 'xplan',
            bdType: 'text'
          },
          {
            fieldName: 'Compañía', class: 'col-md-6',
            type: 'select',
            form_control: true,
            defaultValue: 1,
            url: '/api/v1/maestros/companias',
            binding_change_fields: ['ctiposervicio'],
            key: 'ccompania',
            bdType: 'number'
          },
          {
            fieldName: 'Moneda', class: 'col-md-6',
            type: 'select',
            url: '/api/v1/maestros/monedas',
            key: 'cmoneda',
            bdType: 'number'
          },
          { 
            fieldName: 'País', class: 'col-md-6',
            type: 'select',
            url: '/api/v1/maestros/paises',
            key: 'cpais',
            bdType: 'number'
          },
          { 
            fieldName: 'Costo Total', class: 'col-md-6',
            type: 'text',
            key: 'mcosto',
            bdType: 'number'
          },
          {
            fieldName: 'Servicios',
            modalTitle: 'Informacion del Servicio',
            class: 'col-md-12',
            type: 'multiple-select',
            key_form: 'cservicio',
            added_data_key: 'ctiposervicio',
            key: 'ctiposervicio',
            url: '/api/v1/services/getTypeServices',
            url_id: 'ccompania',
            other_info: true,
            other_values: [
              {
                text: 'Usos',
                type: 'number',
                key: 'nusos',
                value: 0,
                class: 'col-md-12'
              }
            ],
            bdType: 'extern'
          }
        ]
      }
    },
    { 
      path: 'planes/info/:id',   component: ItemFormComponent, data: {
        title: 'Información del Plan',
        mode: 'info',
        mainUrl: '/api/v1/plan/',
        editUrl: '/api/v1/plan/edit/',
        formId: 'edit_plan',
        disableUrl: '/api/v1/plan/disable/',
        fields: [
          {
            fieldName: 'Nombre del Plan', class: 'col-md-6',
            type: 'text', 
            key: 'xplan',
            bdType: 'text'
          },
          {
            fieldName: 'Compañía', class: 'col-md-6',
            type: 'select',
            url: '/api/v1/maestros/companias',
            key: 'ccompania',
            bdType: 'number',
            disabledField: true,
          },
          {
            fieldName: 'Moneda', class: 'col-md-6',
            type: 'select',
            url: '/api/v1/maestros/monedas',
            key: 'cmoneda',
            bdType: 'number'
          },
          { 
            fieldName: 'País', class: 'col-md-6',
            type: 'select',
            url: '/api/v1/maestros/paises',
            key: 'cpais',
            bdType: 'number'
          },
          { 
            fieldName: 'Costo Total', class: 'col-md-6',
            type: 'text',
            key: 'mcosto',
            bdType: 'number'
          },
          {
            fieldName: 'Servicios', class: 'col-md-12',
            type: 'multiple-select',
            modalTitle: 'Informacion del Servicio',
            url: '/api/v1/services/getTypeServices',
            key_form: 'cservicio',
            added_data_key: 'ctiposervicio',
            url_id: 'ccompania',
            key: 'ctiposervicio',
            other_info: true,
            other_values: [
              {
                text: 'Usos',
                type: 'number',
                key: 'nusos',
                value: '0',
                class: 'col-md-12'
              }
            ],
            bdType: 'extern'
          }
        ]
      } 
    },
    
];
