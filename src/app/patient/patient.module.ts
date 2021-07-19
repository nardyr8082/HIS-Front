import { PatientRoutingModule } from './patient-routing.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientPageComponent } from './pages/patient-page/patient-page.component';
import { PatientItemComponent } from './pages/patient-item/patient-item.component';
import { PatientDetailsComponent } from './pages/patient-details/patient-details.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';

@NgModule({
  declarations: [PatientPageComponent, PatientItemComponent, PatientDetailsComponent, PatientFormComponent],
  imports: [CommonModule, SharedModule, PatientRoutingModule],
})
export class PatientModule {}
