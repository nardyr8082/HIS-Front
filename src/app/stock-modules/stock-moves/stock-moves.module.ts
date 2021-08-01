import { WarehouseMovementDetailModule } from './../warehouse-movement-detail/warehouse-movement-detail.module';
import { ProductstockModule } from './../productstock/productstock.module';
import { SharedModule } from './../../shared/shared.module';
import { StockMovesFormComponent } from './components/stock-moves-form/stock-moves-form.component';
import { StockMovesItemComponent } from './pages/stock-moves-item/stock-moves-item.component';
import { StockMovesPageComponent } from './pages/stock-moves-page/stock-moves-page.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockMoveRoutingModule } from './stock-moves-routing.module';
import { StockMovesDetailFormComponent } from './components/stock-moves-detail-form/stock-moves-detail-form.component';

@NgModule({
  declarations: [StockMovesPageComponent, StockMovesItemComponent, StockMovesFormComponent, StockMovesDetailFormComponent],
  imports: [CommonModule, SharedModule, StockMoveRoutingModule, ProductstockModule, WarehouseMovementDetailModule],
})
export class StockMovesModule {}
