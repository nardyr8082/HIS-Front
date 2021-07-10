import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramRoutingModule } from './program-routing.module';
import { ProgramPageComponent } from './pages/program-page/program-page.component';
import { ProgramFormComponent } from './components/program-form/program-form.component';

@NgModule({
  declarations: [ProgramPageComponent, ProgramFormComponent],
  imports: [CommonModule, ProgramRoutingModule, SharedModule],
  entryComponents: [ProgramFormComponent],
})
export class ProgramModule {}
