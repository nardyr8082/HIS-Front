import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFamilyPageComponent } from './pages/product-family-page/product-family-page.component';
import { ProductFamilyRoutingModule } from './product-family-routing.module';
import { ProductFamilyFormComponent } from './components/product-family-form/product-family-form.component';

@NgModule({
  declarations: [ProductFamilyFormComponent, ProductFamilyPageComponent],
  imports: [CommonModule, ProductFamilyRoutingModule, SharedModule],
  entryComponents: [ProductFamilyFormComponent],
})
export class ProductFamilyModule {}
