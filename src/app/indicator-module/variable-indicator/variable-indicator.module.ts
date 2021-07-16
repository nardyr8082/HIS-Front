import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VariableIndicatorPageComponent } from './pages/variable-indicator-page/variable-indicator-page.component';
import { VariableIndicatorRoutingModule } from './variable-indicator-routing.module';
import { VariableIndicatorFormComponent } from './components/variable-indicator-form/variable-indicator-form.component';

@NgModule({
  declarations: [VariableIndicatorFormComponent, VariableIndicatorPageComponent],
  imports: [CommonModule, VariableIndicatorRoutingModule, SharedModule],
  entryComponents: [VariableIndicatorFormComponent],
})
export class VariableIndicatorModule {}
