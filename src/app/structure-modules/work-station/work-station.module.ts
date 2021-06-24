import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkStationFormComponent } from './components/work-station-form/work-station-form.component';
import { WorkStationPageComponent } from './pages/work-station-page/work-station-page.component';
import { SharedModule } from '../../shared/shared.module';
import { WorkStationRoutingModule } from './work-station-routing.module';

@NgModule({
  declarations: [WorkStationFormComponent, WorkStationPageComponent],
  imports: [CommonModule, WorkStationRoutingModule, SharedModule],
  entryComponents: [WorkStationFormComponent],
})
export class WorkStationModule {}
