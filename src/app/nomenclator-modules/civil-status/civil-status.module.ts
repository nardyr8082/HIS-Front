import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CivilStatusPageComponent } from './pages/civil-status-page/civil-status-page.component';
import { CivilStatusFormComponent } from './components/civil-status-form/civil-status-form.component';
import { SharedModule } from '../../shared/shared.module';
import { CivilStatusRoutingModule } from './civil-status-routing.module';


@NgModule({
  declarations: [CivilStatusPageComponent, CivilStatusFormComponent],
  imports: [
    CommonModule,
    CivilStatusRoutingModule,
    SharedModule
  ],
  entryComponents:[CivilStatusFormComponent]
})
export class CivilStatusModule { }
