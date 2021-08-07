import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClinicHistoryStaticPageComponent } from './clinic-history-static-page/clinic-history-static-page.component';
import { LayoutComponent } from '../../../app/shared/layout/layout.component';
import { ClinicHistoryDetailsComponent } from './clinic-history-static-page/clinic-history-static-details/clinic-history-details/clinic-history-details.component';
import {ClinicHistoryStaticPinComponent} from './clinic-history-static-page/clinic-history-static-pin/clinic-history-static-pin/clinic-history-static-pin.component'
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ClinicHistoryStaticPageComponent,
      },
      {
        path: 'details/:id',
        component: ClinicHistoryDetailsComponent,
      },
      {
        path: 'pin/:id',
        component: ClinicHistoryStaticPinComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicHistoryStaticRoutingModule { }
