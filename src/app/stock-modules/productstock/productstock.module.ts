import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductstockRoutingModule } from './productstock-routing.module';
import { ProductstockPageComponent } from './pages/productstock-page/productstock-page.component';
import { ProductstockFormComponent } from './components/productstock-form/productstock-form.component';

@NgModule({
  declarations: [ProductstockPageComponent, ProductstockFormComponent],
  imports: [CommonModule, ProductstockRoutingModule, SharedModule],
  entryComponents: [ProductstockFormComponent],
  exports: [ProductstockFormComponent],
})
export class ProductstockModule {}
