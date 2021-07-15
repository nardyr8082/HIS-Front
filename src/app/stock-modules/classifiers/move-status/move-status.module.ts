import { SharedModule } from './../../../shared/shared.module';

import { MoveStatusRoutingModule } from './move-status-routing.module';
import { MoveStatusPageComponent } from './pages/move-status-page/move-status-page.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoveStatusFormComponent } from './components/move-status-form.component/move-status-form.component';

@NgModule({
  declarations: [MoveStatusPageComponent, MoveStatusFormComponent],
  imports: [CommonModule, SharedModule, MoveStatusRoutingModule],
  entryComponents: [MoveStatusFormComponent],
})
export class MoveStatusModule {}
