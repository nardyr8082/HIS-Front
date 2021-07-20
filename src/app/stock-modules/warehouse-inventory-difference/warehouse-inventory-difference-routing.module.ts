import {WarehouseInventoryDifferencePageComponent} from './pages/warehouse-inventory-difference-page/warehouse-inventory-difference-page.component'
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../app/shared/layout/layout.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: WarehouseInventoryDifferencePageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseInventoryDifferenceRoutingModule { }
