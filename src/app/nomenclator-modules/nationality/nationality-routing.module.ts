import { NationalityPageComponent } from './pages/nationality-page/nationality-page.component';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: NationalityPageComponent,
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
export class NationalityRoutingModule {}
