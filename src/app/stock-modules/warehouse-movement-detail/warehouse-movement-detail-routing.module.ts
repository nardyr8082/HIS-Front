import { LayoutComponent } from '../../../app/shared/layout/layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WarehouseMovementDetailPageComponent } from './pages/warehouse-movement-detail-page/warehouse-movement-detail-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: WarehouseMovementDetailPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseMovementDetailRoutingModule { }
