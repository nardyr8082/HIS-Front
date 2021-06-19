import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';

import { RaceRoutingModule } from './race-routing.module';
import { RacePageComponent } from './pages/race-page/race-page.component';
import { RaceFormComponent } from './components/race-form/race-form.component';


@NgModule({
  declarations: [RaceFormComponent, RacePageComponent],
  imports: [
    CommonModule,
    RaceRoutingModule,
    SharedModule
  ],
  entryComponents: [RaceFormComponent]
})
export class RaceModule { }
