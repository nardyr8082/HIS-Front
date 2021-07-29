import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { ClinicHistoryStaticRoutingModule } from './clinic-history-static-routing.module';
import { ClinicHistoryStaticFormComponent } from './clinic-history-static-form/clinic-history-static-form.component';
import { ClinicHistoryStaticPageComponent } from './clinic-history-static-page/clinic-history-static-page.component';


@NgModule({
  declarations: [ClinicHistoryStaticFormComponent, ClinicHistoryStaticPageComponent],
  imports: [
    CommonModule,
    ClinicHistoryStaticRoutingModule,
    SharedModule
  ],
  entryComponents: [ClinicHistoryStaticFormComponent]
})
export class ClinicHistoryStaticModule { }
