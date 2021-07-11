import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';

@NgModule({
  declarations: [CategoryPageComponent, CategoryFormComponent],
  imports: [CommonModule, CategoryRoutingModule, SharedModule],
  entryComponents: [CategoryFormComponent],
})
export class CategoryModule {}
