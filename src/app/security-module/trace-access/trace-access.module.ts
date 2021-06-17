import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TraceAccessRoutingModule } from './trace-access-routing.module';
import { TraceAccessPageComponent } from './pages/trace-access-page/trace-access-page.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [TraceAccessPageComponent],
  imports: [
    CommonModule,
    TraceAccessRoutingModule,
    SharedModule
  ]
})
export class TraceAccessModule { }
