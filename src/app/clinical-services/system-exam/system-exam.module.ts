import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemExamPageComponent } from './pages/system-exam-page/system-exam-page.component';
import { SystemExamRoutingModule } from './system-exam-routing.module';
import { SystemExamFormComponent } from './components/system-exam-form/system-exam-form.component';

@NgModule({
  declarations: [SystemExamFormComponent, SystemExamPageComponent],
  imports: [CommonModule, SystemExamRoutingModule, SharedModule],
  entryComponents: [SystemExamFormComponent],
})
export class SystemExamModule {}
