import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { HealtUnitFormComponent } from './components/healt-unit-form/healt-unit-form.component';
import { HealthUnitPageComponent } from './pages/health-unit-page/health-unit-page.component';

import { HealthUnitRoutingModule } from './health-unit-routing.module';


@NgModule({
  declarations: [HealtUnitFormComponent, HealthUnitPageComponent],
  imports: [
    CommonModule,
    HealthUnitRoutingModule,
    SharedModule
  ]
})
export class HealthUnitModule { }
