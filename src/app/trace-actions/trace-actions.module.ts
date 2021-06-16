import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraceActionsPageComponent } from './pages/trace-actions-page/trace-actions-page.component';
import { TraceActionsRoutingModule } from './trace-actions-routing.module';

@NgModule({
  declarations: [TraceActionsPageComponent],
  imports: [CommonModule, TraceActionsRoutingModule, SharedModule],
})
export class TraceActionsModule {}
