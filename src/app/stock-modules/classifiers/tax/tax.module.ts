import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxRoutingModule } from './tax-routing.module';
import { TaxPageComponent } from './pages/tax-page/tax-page.component';
import { TaxFormComponent } from './components/tax-form/tax-form.component';

@NgModule({
  declarations: [TaxPageComponent, TaxFormComponent],
  imports: [CommonModule, TaxRoutingModule, SharedModule],
  entryComponents: [TaxFormComponent],
})
export class TaxModule {}
