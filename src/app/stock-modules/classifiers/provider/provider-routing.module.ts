import { LayoutComponent } from '../../../shared/layout/layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderPageComponent } from './pages/provider-page/provider-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ProviderPageComponent,
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
export class ProvierRoutingModule {}
