import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AppointmentRoutingModule } from './appointment-routing.module';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { AppointmentPageComponent } from './pages/appointment-page/appointment-page.component';


@NgModule({
  declarations: [AppointmentFormComponent, AppointmentPageComponent],
  imports: [
    CommonModule,
    AppointmentRoutingModule,
    SharedModule
  ],
  entryComponents:[AppointmentFormComponent]
})
export class AppointmentModule { }
