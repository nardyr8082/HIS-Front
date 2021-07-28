import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../app/shared/layout/layout.component';
import { PhysicalexamPageComponent } from './pages/physicalexam-page/physicalexam-page.component';



const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: PhysicalexamPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhysicalexamRoutingModule {}
