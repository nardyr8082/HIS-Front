import { TranferEmitedStockPageComponent } from './pages/transfer-emited-stock-page/transfer-emited-stock-page.component';
import { TranferEmitedStockRoutingModule } from './transfer-emited-stock-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranferEmitedStockFormComponent } from './components/transfer-emited-stock-form/transfer-emited-stock-form.component';

@NgModule({
  declarations: [TranferEmitedStockPageComponent, TranferEmitedStockFormComponent],
  imports: [CommonModule, TranferEmitedStockRoutingModule, SharedModule],
  entryComponents: [TranferEmitedStockFormComponent],
})
export class TransferEmitedStockModule {}
