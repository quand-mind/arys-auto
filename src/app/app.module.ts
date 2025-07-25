import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from "ngx-cookie-service";

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { TableListComponent } from './components/table-list/table-list.component';
import { ItemFormComponent } from './components/item-form/item-form.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ClubLayoutComponent } from './layouts/club-layout/club-layout.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalCarComponent } from './components/user-profile/modal-car/modal-car.component';
import { FilterComponent } from './components/filter/filter.component';
import { ContratosModule } from './components/contratos/contratos.module';
import { MembershipComponent } from './components/contratos/contract/membership/membership.component';
import { StepOneComponent } from './components/contratos/contract/membership/step-one/step-one.component';
import { ContractComponent } from './components/contratos/contract/contract.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UpgradeComponent } from './components/upgrade/upgrade.component';
import { TypographyComponent } from './components/typography/typography.component';
import { IconsComponent } from './components/icons/icons.component';
import { MapsComponent } from './components/maps/maps.component';
import { ChartsModule } from 'ng2-charts';
import { MaterialExampleModule } from './material.module';
import { NotificationsComponent } from './components/events/notifications/notifications.component';
import { CreateNotificationComponent } from './components/events/notifications/create-notification/create-notification.component';
import { TrackingComponent } from './components/tracking/tracking.component';
import { TrackingFormComponent } from './components/tracking/tracking-form/tracking-form.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DocumentsComponent } from './components/user-profile/documents/documents.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialExampleModule,
    ChartsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgbModule,
    ToastrModule.forRoot(),
    MatFormFieldModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatExpansionModule,
    ImageCropperModule,
    PdfViewerModule
  ],
  declarations: [
    AppComponent,
    NotificationsComponent,
    CreateNotificationComponent,
    TableListComponent,
    UserProfileComponent,
    ItemFormComponent,
    ModalCarComponent,
    MembershipComponent,
    StepOneComponent,
    FilterComponent,
    ContractComponent,
    DashboardComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    ClubLayoutComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    TrackingComponent,
    TrackingFormComponent,
    DocumentsComponent
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
