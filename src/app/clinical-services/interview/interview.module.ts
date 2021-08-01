import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { InterviewRoutingModule } from './interview-routing.module';
import { InterviewFormComponent } from './components/interview-form/interview-form.component';
import { InterviewPageComponent } from './pages/interview-page/interview-page.component';


@NgModule({
  declarations: [InterviewFormComponent, InterviewPageComponent],
  imports: [
    CommonModule,
    InterviewRoutingModule,
    SharedModule
  ],
  entryComponents: [InterviewFormComponent]
})
export class InterviewModule { }
