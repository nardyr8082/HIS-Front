import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceStatusRoutingModule } from './invoice-status-routing.module';
import { InvoiceStatusPageComponent } from './pages/invoice-status-page/invoice-status-page.component';
import { InvoiceStatusFormComponent } from './components/invoice-status-form/invoice-status-form.component';

@NgModule({
  declarations: [InvoiceStatusPageComponent, InvoiceStatusFormComponent],
  imports: [CommonModule, InvoiceStatusRoutingModule, SharedModule],
  entryComponents: [InvoiceStatusFormComponent],
})
export class InvoiceStatusModule {}
