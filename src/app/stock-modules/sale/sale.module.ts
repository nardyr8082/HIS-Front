import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalePageComponent } from './pages/sale-page/sale-page.component';
import { SaleRoutingModule } from './sale-routing.module';
import { SaleFormComponent } from './components/sale-form/sale-form.component';

@NgModule({
  declarations: [SaleFormComponent, SalePageComponent],
  imports: [CommonModule, SaleRoutingModule, SharedModule],
  entryComponents: [SaleFormComponent],
})
export class SaleModule {}
