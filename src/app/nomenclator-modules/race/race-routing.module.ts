import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RacePageComponent } from './pages/race-page/race-page.component';
import { LayoutComponent } from '../../shared/layout/layout.component';


const routes: Routes = [
 {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: RacePageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RaceRoutingModule { }
