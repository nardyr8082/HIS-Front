import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrequencyPageComponent } from './pages/frequency-page/frequency-page.component';
import { FrequencyFormComponent } from './components/frequency-form/frequency-form.component';
import { FrequencyRoutingModule } from './frequency-routing.module';

@NgModule({
  declarations: [FrequencyPageComponent, FrequencyFormComponent],
  imports: [CommonModule, FrequencyRoutingModule, SharedModule],
  entryComponents: [FrequencyFormComponent],
})
export class FrequencyModule {}
