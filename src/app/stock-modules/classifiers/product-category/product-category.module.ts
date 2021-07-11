import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategoryRoutingModule } from './product-category-routing.module';
import { ProductCategoryPageComponent } from './pages/product-category-page/product-category-page.component';
import { ProductCategoryFormComponent } from './components/product-category-form/product-category-form.component';

@NgModule({
  declarations: [ProductCategoryPageComponent, ProductCategoryFormComponent],
  imports: [CommonModule, ProductCategoryRoutingModule, SharedModule],
  entryComponents: [ProductCategoryFormComponent],
})
export class ProductCategoryModule {}
