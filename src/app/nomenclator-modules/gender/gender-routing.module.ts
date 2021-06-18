import { LayoutComponent } from '../../shared/layout/layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenderPageComponent } from './pages/gender-page/gender-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: GenderPageComponent,
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
export class GenderRoutingModule {}
