import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClinicHistoryStaticPageComponent } from './clinic-history-static-page/clinic-history-static-page.component';
import { LayoutComponent } from '../../../app/shared/layout/layout.component';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ClinicHistoryStaticPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicHistoryStaticRoutingModule { }
