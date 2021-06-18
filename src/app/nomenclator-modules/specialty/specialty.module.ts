import { SharedModule } from './../../shared/shared.module';
import { SpecialtyRoutingModule } from './specialty-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecialtyFormComponent } from './components/specialty-form/specialty-form.component';
import { SpecialtyPageComponent } from './pages/specialty-page/specialty-page.component';

@NgModule({
  declarations: [SpecialtyFormComponent, SpecialtyPageComponent],
  imports: [CommonModule, SpecialtyRoutingModule, SharedModule],
  entryComponents: [SpecialtyFormComponent],
})
export class SpecialtyModule {}
