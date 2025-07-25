import { Routes } from '@angular/router';
import { TableListComponent } from '../table-list/table-list.component';
import { ItemFormComponent } from '../item-form/item-form.component';
import { TrackingComponent } from './tracking.component';
import { TrackingFormComponent } from './tracking-form/tracking-form.component';
const date = new Date()

export const TrackingRoutes: Routes = [
  {path: 'tracking',      component: TrackingComponent, data: {title: 'Seguimiento de Notificaciones',}},
  { 
    path: 'tracking/list',     component: TableListComponent, data: {
      title: 'Listado de Seguimientos',
      tableId: 'tracking_list',
      redirectUrl: '/admin/events/notifications/',
      noCreate: true,
      url: '/api/v1/events/getSeguimientos',
      tableInfo: [
        { headerName: 'Codigo Notificacion', key: 'cnotificacion', primary_key: true },
        { headerName: 'Tipo Seguimiento', key: 'xtiposeguimiento' },
        { headerName: 'Motivo Seguimiento', key: 'xmotivoseguimiento' },
        { headerName: 'Observacion', key: 'xobservacion' },
      ],
      extraInfo: [
        {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
        // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
      ],
      filtersData: [
        // {title: 'Compañia', key: 'ccompania', controlValue: '', data: [], url: '/api/v1/maestros/companias'},
        {title: 'Vencimiento', key: 'fseguimientonotificacion', controlValue: '',
          data: [
            {text: 'Atrasados', value: '<'},
            {text: 'Al Día', value: '='},
            {text: 'Pendientes', value: '>'},
          ],
        },
      ]
    }
  },
  { 
    path: 'tracking/list/:type',     component: TableListComponent, data: {
      title: 'Listado de Seguimientos',
      noCreate: true,
      tableId: 'tracking_list',
      redirectUrl: '/admin/events/notifications/',
      url: '/api/v1/events/getSeguimientos',
      tableInfo: [
        { headerName: 'Codigo Notificacion', key: 'cnotificacion', primary_key: true },
        { headerName: 'Tipo Seguimiento', key: 'xtiposeguimiento' },
        { headerName: 'Motivo Seguimiento', key: 'xmotivoseguimiento' },
        { headerName: 'Observacion', key: 'xobservacion' },
      ],
      extraInfo: [
        {headerName: 'Informacion', action:'info', icon: 'fa-solid fa-edit', url:'info/'},
        // {headerName: 'Certificado', action:'see_certify', icon: 'fa-solid fa-paperclip', url:'/api/v1/plan/verCertificado/'}
      ],
      filterDefaultKey: 'fseguimientonotificacion',
      filtersData: [
        // {title: 'Compañia', key: 'ccompania', controlValue: '', data: [], url: '/api/v1/maestros/companias'},
        {title: 'Vencimiento', key: 'fseguimientonotificacion', controlValue: '',
          data: [
            {text: 'Atrasados', value: '<'},
            {text: 'Al Día', value: '='},
            {text: 'Pendientes', value: '>'},
          ],
        },
      ]
    }
  },
  { 
    path: 'tracking/info/:id',   component: TrackingFormComponent, data: {
      title: 'Evento N°',
      mode: 'info',
      mainUrl: '/api/v1/events/get/',
      editUrl: '/api/v1/tracking/edit/',
      formId: 'tracking_info',
      disableUrl: '/api/v1/tracking/disable/',
    } 
  },
    
];
