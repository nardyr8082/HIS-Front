import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiseasePageComponent } from './pages/disease-page/disease-page.component';
import { DiseaseFormComponent } from './components/disease-form/disease-form.component';
import { DiseaseRoutingModule } from './disease-routing.module';

@NgModule({
  declarations: [DiseasePageComponent, DiseaseFormComponent],
  imports: [CommonModule, DiseaseRoutingModule, SharedModule],
  entryComponents: [DiseaseFormComponent],
})
export class DiseaseModule {}
