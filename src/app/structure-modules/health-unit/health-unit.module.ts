import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { HealthUnitFormComponent } from './components/health-unit-form/health-unit-form.component';
import { HealthUnitPageComponent } from './pages/health-unit-page/health-unit-page.component';

import { HealthUnitRoutingModule } from './health-unit-routing.module';

@NgModule({
  declarations: [HealthUnitFormComponent, HealthUnitPageComponent],
  imports: [
    CommonModule,
    HealthUnitRoutingModule,
    SharedModule
  ]
})
export class HealthUnitModule {}
