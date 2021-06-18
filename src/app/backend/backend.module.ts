import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendRoutingModule } from './backend-routing.module';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonDialogsModule } from './common-dialogs-module/common-dialogs.module';
import { SharedModule } from '../shared/shared.module';
import { PreviousRouteService } from '../core/services/previous-route/previous-route.service';
import { DashboardComponent } from './appBackoffice/dashboard/dashboard.component';

@NgModule({
  imports: [CommonModule, BackendRoutingModule, ReactiveFormsModule, FormsModule, FlexLayoutModule, CommonDialogsModule, SharedModule],
  providers: [PreviousRouteService],
  declarations: [DashboardComponent]
})
export class BackendModule {}
