import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaestrosComponent } from './maestros.component'

const routes: Routes = [
  { 
    path: 'maestros',      component: MaestrosComponent, data: {
      title: 'Maestros',
      url: '/api/v1/maestros',
      tableId: 'maestros',
    },
  },
  {
  path: 'maestros', children: [
    {
      path: '',
      loadChildren: () => 
          import('./monedas/monedas.module').then(x=>x.MonedasModule)
    },
    {
      path: '',
      loadChildren: () => 
          import('./proveedores/proveedores.module').then(x=>x.ProveedoresModule)
    },
    {
      path: '',
      loadChildren: () => 
          import('../../components/maestros/paises/paises.module').then(x=>x.PaisesModule)
    },
    {
      path: '',
      loadChildren: () => 
          import('../../components/maestros/companias/companias.module').then(x=>x.CompaniasModule)
    },
    {
      path: '',
      loadChildren: () => 
          import('../../components/maestros/propietarios/propietarios.module').then(x=>x.PropietariosModule)
    }, 
    {
      path: '',
      loadChildren: () => 
          import('../../components/maestros/parentescos/parentescos.module').then(x=>x.ParentescosModule)
    }, 
    {
      path: '',
      loadChildren: () => 
          import('../../components/maestros/estadocivil/estadocivil.module').then(x=>x.EstadocivilModule)
    }, 
    {
      path: '',
      loadChildren: () => 
          import('../../components/maestros/tipodocidentidad/tipodocidentidad.module').then(x=>x.TipodocidentidadModule)
    },  
    {
      path: '',
      loadChildren: () => 
          import('../../components/maestros/bancos/bancos.module').then(x=>x.BancosModule)
    },
    {
      path: '',
      loadChildren: () => 
          import('../../components/maestros/vehiculos/vehiculos.module').then(x=>x.VehiculosModule)
    },
    {
      path: '',
      loadChildren: () => 
          import('../../components/maestros/marcas/marcas.module').then(x=>x.MarcasModule)
    },
    {
      path: '',
      loadChildren: () => 
          import('./metodologiapago/metodologiapago.module').then(x=>x.MetodologiapagoModule)
    },
  ]},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaestrosRoutingModule { }
