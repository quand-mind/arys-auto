import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsComponent } from '../events/notifications/notifications.component';
import { CreateNotificationComponent } from '../events/notifications/create-notification/create-notification.component';

const routes: Routes = [
  { 
    path: 'events',      component: NotificationsComponent, data: {
      title: 'Notificaciones',
      url: '/api/v1/notifications',
      tableId: 'notificaciones',
    }
  },
  { 
    path: 'events/notifications/create',     component: CreateNotificationComponent, data: {
      type: 'create',
      title: 'Creacion de Notificaciones',
      formId: 'events-create',
      mode: 'create',
      mainUrl: 'api/events'
    }
  },
  { 
    path: 'events/notifications/:id"',     component: CreateNotificationComponent, data: {
      type: 'update',
      title: 'Notificacion N°',
      formId: 'events-update',
      mode: 'update',
      mainUrl: 'api/events'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
