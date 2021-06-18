import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenderRoutingModule } from './gender-routing.module';
import { GenderPageComponent } from './pages/gender-page/gender-page.component';
import { GenderFormComponent } from './components/gender-form/gender-form.component';

@NgModule({
  declarations: [GenderPageComponent, GenderFormComponent],
  imports: [CommonModule, GenderRoutingModule, SharedModule],
  entryComponents: [GenderFormComponent],
})
export class GenderModule {}
