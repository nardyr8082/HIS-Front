import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TreatmentExecutionsRoutingModule } from './treatment-executions-routing.module';
import { TreatmentExecutionsFormComponent } from './components/treatment-executions-form/treatment-executions-form.component';
import { TreatmentExecutionsPageComponent } from './pages/treatment-executions-page/treatment-executions-page.component';


@NgModule({
  declarations: [TreatmentExecutionsFormComponent, TreatmentExecutionsPageComponent],
  imports: [
    CommonModule,
    TreatmentExecutionsRoutingModule,
    SharedModule
  ],
  entryComponents: [TreatmentExecutionsFormComponent]
})
export class TreatmentExecutionsModule { }
