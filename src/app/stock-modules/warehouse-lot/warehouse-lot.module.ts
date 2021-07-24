import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseLotRoutingModule } from './warehouse-lot-routing.module';
import { WarehouseLotFormComponent } from './components/warehouse-lot-form/warehouse-lot-form.component';
import { WarehouseLotPageComponent } from './pages/warehouse-lot-page/warehouse-lot-page.component';


@NgModule({
  declarations: [WarehouseLotFormComponent, WarehouseLotPageComponent],
  imports: [
    CommonModule,
    WarehouseLotRoutingModule,
    SharedModule
  ],
  entryComponents: [WarehouseLotFormComponent],
})
export class WarehouseLotModule { }
