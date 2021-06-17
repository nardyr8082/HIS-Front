import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MunicipalityPageComponent } from './pages/municipality-page/municipality-page.component';
import { MunicipalityRoutingModule } from './municipality-routing.module';
import { MunicipalityFormComponent } from './components/municipality-form/municipality-form.component';

@NgModule({
  declarations: [MunicipalityPageComponent, MunicipalityFormComponent],
  imports: [CommonModule, SharedModule, MunicipalityRoutingModule],
  entryComponents: [MunicipalityFormComponent],
})
export class MunicipalityModule {}
