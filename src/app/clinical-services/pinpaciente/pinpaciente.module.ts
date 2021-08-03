import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinpacienteFormComponent } from './components/pinpaciente-form/pinpaciente-form.component';
import { PinpacienteRoutingModule } from './pinpaciente-routing.module';
import { PinpacientePageComponent } from './pages/pinpaciente-page/pinpaciente-page.component';




@NgModule({
  declarations: [PinpacienteFormComponent, PinpacientePageComponent],
  imports: [CommonModule, PinpacienteRoutingModule, SharedModule],
  entryComponents: [PinpacienteFormComponent],
})
export class PinpacienteModule {}
