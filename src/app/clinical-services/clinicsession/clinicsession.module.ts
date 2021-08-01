import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicsessionFormComponent } from './components/clinicsession-form/clinicsession-form.component';
import { ClinicsessionRoutingModule } from './clinicsession-routing.module';
import { ClinicsessionPageComponent } from './pages/clinicsession-page/clinicsession-page.component';



@NgModule({
  declarations: [ClinicsessionFormComponent, ClinicsessionPageComponent],
  imports: [CommonModule, ClinicsessionRoutingModule, SharedModule],
  entryComponents: [ClinicsessionFormComponent],
})
export class ClinicsessionModule {}
