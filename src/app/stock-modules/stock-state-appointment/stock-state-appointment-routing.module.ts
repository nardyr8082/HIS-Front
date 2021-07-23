import { LayoutComponent } from './../../shared/layout/layout.component';
import { StockStateAppointmentPageComponent } from './pages/stock-state-appointment-page/stock-state-appointment-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: StockStateAppointmentPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockStateAppointmentRoutingModule {}
