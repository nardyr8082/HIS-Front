import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicatorPageComponent } from './pages/indicator-page/indicator-page.component';
import { IndicatorRoutingModule } from './indicator-routing.module';
import { IndicatorFormComponent } from './components/indicator-form/indicator-form.component';

@NgModule({
  declarations: [IndicatorFormComponent, IndicatorPageComponent],
  imports: [CommonModule, IndicatorRoutingModule, SharedModule],
  entryComponents: [IndicatorFormComponent],
})
export class IndicatorModule {}
