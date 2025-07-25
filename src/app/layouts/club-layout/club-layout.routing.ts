import { Routes } from '@angular/router';

import { UserProfileComponent } from '../../components/user-profile/user-profile.component';
import { TableListComponent } from '../../components/table-list/table-list.component';
import { ClubLayoutComponent } from './club-layout.component';

export const ClubLayoutRoutes: Routes = [
  { path: '', component: ClubLayoutComponent, children: [

    { path: 'userDetails',   component: UserProfileComponent },
    {
      path: '',
      loadChildren: () => 
          import('../../components/ordenes/ordenes.module').then(x=>x.OrdenesModule)
    },
  ]}
    
];
