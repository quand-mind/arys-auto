import { Routes } from '@angular/router';

import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { UserProfileComponent } from '../../components/user-profile/user-profile.component';
import { TypographyComponent } from '../../components/typography/typography.component';
import { IconsComponent } from '../../components/icons/icons.component';
import { MapsComponent } from '../../components/maps/maps.component';
import { AdminLayoutComponent } from './admin-layout.component';

export const AdminLayoutRoutes: Routes = [
    { path: '', component: AdminLayoutComponent, children: [
      { path: 'dashboard',      component: DashboardComponent },
      {
        path: '',
        loadChildren: () => 
            import('../../components/contratos/contratos.module').then(x=>x.ContratosModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/events/events.module').then(x=>x.EventsModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/maestros.module').then(x=>x.MaestrosModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/maestros/paises/paises.module').then(x=>x.PaisesModule)
      }, 
      {
        path: '',
        loadChildren: () => 
            import('../../components/planes/planes.module').then(x=>x.PlanesModule)
      },
      {
        path: '',
        loadChildren: () => 
            import('../../components/tracking/tracking.module').then(x=>x.TrackingModule)
      },
      { path: 'user-profile',   component: UserProfileComponent },
      { path: 'typography',     component: TypographyComponent },
      { path: 'icons',          component: IconsComponent },
      { path: 'maps',           component: MapsComponent },
      { path: 'user',        component: UserProfileComponent },
    ] },
    
];
