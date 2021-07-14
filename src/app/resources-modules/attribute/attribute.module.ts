import { AttributeRoutingModule } from './attribute-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributePageComponent } from './pages/attribute-page/attribute-page.component';
import { AttributeFormComponent } from './components/attribute-form/attribute-form.component';

@NgModule({
  declarations: [AttributePageComponent, AttributeFormComponent],
  imports: [CommonModule, AttributeRoutingModule, SharedModule],
  entryComponents: [AttributeFormComponent],
})
export class AttributeModule {}
