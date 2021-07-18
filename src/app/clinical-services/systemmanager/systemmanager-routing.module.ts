import { LayoutComponent } from '../../shared/layout/layout.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemmanagerPageComponent } from './pages/systemmanager-page/systemmanager-page.component';



const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component:  SystemmanagerPageComponent,
      },
    ],
  },
  // {
  //   path: '**',
  //   redirectTo: 'product'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class  SystemmanagerRoutingModule {}
