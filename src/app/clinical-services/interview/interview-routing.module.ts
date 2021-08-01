import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../app/shared/layout/layout.component';
import { InterviewPageComponent } from '../interview/pages/interview-page/interview-page.component';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: InterviewPageComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterviewRoutingModule { }
