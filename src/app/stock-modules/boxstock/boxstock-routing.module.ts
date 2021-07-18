import { LayoutComponent } from '../../shared/layout/layout.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoxstockPageComponent } from './pages/boxstock-page/boxstock-page.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: BoxstockPageComponent,
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
export class BoxstockRoutingModule {}
