import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { ClinicHistoryStaticRoutingModule } from './clinic-history-static-routing.module';
import { ClinicHistoryStaticFormComponent } from './clinic-history-static-form/clinic-history-static-form.component';
import { ClinicHistoryStaticPageComponent } from './clinic-history-static-page/clinic-history-static-page.component';
import { ClinicHistoryDetailsComponent } from './clinic-history-static-page/clinic-history-static-details/clinic-history-details/clinic-history-details.component';
import { ClinicHistoryStaticPinComponent } from './clinic-history-static-page/clinic-history-static-pin/clinic-history-static-pin/clinic-history-static-pin.component';


@NgModule({
  declarations: [ClinicHistoryStaticFormComponent, ClinicHistoryStaticPageComponent, ClinicHistoryDetailsComponent, ClinicHistoryStaticPinComponent],
  imports: [
    CommonModule,
    ClinicHistoryStaticRoutingModule,
    SharedModule
  ],
  entryComponents: [ClinicHistoryStaticFormComponent]
})
export class ClinicHistoryStaticModule { }
