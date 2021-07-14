import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicatorTypePageComponent } from './pages/indicator-type-page/indicator-type-page.component';
import { IndicatorTypeFormComponent } from './components/indicator-type-form/indicator-type-form.component';
import { IndicatorTypeRoutingModule } from './indicator-type-routing.module';

@NgModule({
  declarations: [IndicatorTypePageComponent, IndicatorTypeFormComponent],
  imports: [CommonModule, IndicatorTypeRoutingModule, SharedModule],
  entryComponents: [IndicatorTypeFormComponent],
})
export class IndicatorTypeModule {}
