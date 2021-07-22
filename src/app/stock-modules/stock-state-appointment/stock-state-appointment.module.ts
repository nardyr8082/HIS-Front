import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockStateAppointmentPageComponent } from './pages/stock-state-appointment-page/stock-state-appointment-page.component';
import { StockStateAppointmentFormComponent } from './components/stock-state-appointment-form/stock-state-appointment-form.component';
import { StockStateAppointmentRoutingModule } from './stock-state-appointment-routing.module';

@NgModule({
  declarations: [StockStateAppointmentPageComponent, StockStateAppointmentFormComponent],
  imports: [CommonModule, StockStateAppointmentRoutingModule, SharedModule],
  entryComponents: [StockStateAppointmentFormComponent],
})
export class StockStateAppointmentModule {}
