import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateFormComponent } from './components/state-form/state-form.component';
import { StatePageComponent } from './pages/state-page/state-page.component';
import { StateRoutingModule } from './state-routing.module';

@NgModule({
  declarations: [StateFormComponent, StatePageComponent],
  imports: [CommonModule, StateRoutingModule, SharedModule],
})
export class StateModule {}
