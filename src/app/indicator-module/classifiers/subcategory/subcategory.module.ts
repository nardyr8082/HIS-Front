import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubcategoryPageComponent } from './pages/subcategory-page/subcategory-page.component';
import { SubcategoryRoutingModule } from './subcategory-routing.module';
import { SubcategoryFormComponent } from './components/subcategory-form/subcategory-form.component';

@NgModule({
  declarations: [SubcategoryFormComponent, SubcategoryPageComponent],
  imports: [CommonModule, SubcategoryRoutingModule, SharedModule],
  entryComponents: [SubcategoryFormComponent],
})
export class SubcategoryModule {}
