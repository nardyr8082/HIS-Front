import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommercialOperationRoutingModule } from './commercial-operation-routing.module';
import { CommercialOperationPageComponent } from './pages/commercial-operation-page/commercial-operation-page.component';
import { CommercialOperationFormComponent } from './components/commercial-operation-form/commercial-operation-form.component';

@NgModule({
  declarations: [CommercialOperationPageComponent, CommercialOperationFormComponent],
  imports: [CommonModule, CommercialOperationRoutingModule, SharedModule],
  entryComponents: [CommercialOperationFormComponent],
})
export class CommercialOperationModule {}
