import { LayoutComponent } from '../../../app/shared/layout/layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WarehouseReceivedTransferPageComponent} from './pages/warehouse-received-transfer-page/warehouse-received-transfer-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: WarehouseReceivedTransferPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseReceivedTransferRoutingModule { }
