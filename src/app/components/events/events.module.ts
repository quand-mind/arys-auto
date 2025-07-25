import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';

import { MaterialExampleModule } from './../../../app/material.module'
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationsComponent } from './notifications/notifications.component';
import { CreateNotificationComponent } from './notifications/create-notification/create-notification.component';
import { FilterComponent } from '../filter/filter.component';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    MaterialExampleModule,
    ReactiveFormsModule,
  ]
})
export class EventsModule { }
