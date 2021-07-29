import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TreatmentIndicationsRoutingModule } from './treatment-indications-routing.module';
import { TreatmentIndicationsPageComponent } from './pages/treatment-indications-page/treatment-indications-page.component';
import { TreatmentIndicationsFormComponent } from './components/treatment-indications-form/treatment-indications-form.component';


@NgModule({
  declarations: [TreatmentIndicationsPageComponent, TreatmentIndicationsFormComponent],
  imports: [
    CommonModule,
    TreatmentIndicationsRoutingModule,
    SharedModule
  ],
  entryComponents: [TreatmentIndicationsFormComponent]
})
export class TreatmentIndicationsModule { }
