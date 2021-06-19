import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocTypeIdFormComponent } from './components/doc-type-id-form/doc-type-id-form.component';
import { DocTypeIdRoutingModule } from './doc-type-id-routing.module';
import {DocTypeIdPageComponent} from './pages/doc-type-id-page/doc-type-id-page.component';

@NgModule({
  declarations: [DocTypeIdFormComponent, DocTypeIdPageComponent],
  imports: [CommonModule, DocTypeIdRoutingModule, SharedModule],
})
export class DocTypeIdModule {}
