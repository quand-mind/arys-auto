import { Routes } from '@angular/router';
import { TableListComponent } from '../../table-list/table-list.component';
import { ItemFormComponent } from '../../item-form/item-form.component';

export const MetodologiapagoRoutes: Routes = [
  { 
    path: 'metodologiapago',      component: TableListComponent, data: {
      title: 'Metogologia de Pago',
      url: '/api/v1/metodologiapago/search',
      tableId: 'metodologiapago',
      tableInfo: [
        { headerName: 'Metodologiapago', key: 'cmetodologiapago', primary_key: true },
        { headerName: 'Descripción Metodología', key: 'xmetodologiapago' },
        { headerName: 'Pais', key: 'cpais' },
        { headerName: 'Compania', key: 'ccompania' },
      ],
      extraInfo: [
        {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
        // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
      ]
    }
  },
  { 
    path: 'metodologiapago/create',   component: ItemFormComponent, data: {
      title: 'Crear Nueva Metodología',
      mode: 'create',
      mainUrl: '/api/v1/maestros/metodologiapago',
      createUrl: '/api/v1/metodologiapago/create',
      formId: 'create_metodologiapago',
      fields: [
    
        {
          fieldName: 'Descripción', class: 'col-md-6',
          type: 'text',
          key: 'xmetodologiapago',
          bdType: 'text'
        },
        {
          fieldName: 'País', class: 'col-md-2',
          type: 'text',
          key: 'cpais',
          bdType: 'text'
        },
        {
          fieldName: 'Compañía', class: 'col-md-1',
          type: 'text',
          key: 'ccompania',
          bdType: 'text'
        }
      ]
    } 
  },
  { 
    path: 'metodologiapago/info/:id',   component: ItemFormComponent, data: {
      title: 'Información de la Metodología',
      mode: 'info',
      mainUrl: '/api/v1/metodologiapago/get/',
      editUrl: '/api/v1/metodologiapago/edit/',
      formId: 'edit_metodologiapago',
      disableUrl: '/api/v1/metodologiapago/disable/',
      fields: [      
        {
          fieldName: 'Descripción', class: 'col-md-6',
          type: 'text',
          key: 'xmetodologiapago',
          bdType: 'text'
        },
        {
          fieldName: 'País', class: 'col-md-2',
          type: 'text',
          key: 'cpais',
          bdType: 'text'
        },
        {
          fieldName: 'Compañía', class: 'col-md-1',
          type: 'text',
          key: 'ccompania',
          bdType: 'text'
        }
      ]
    } 
  },
  
];
