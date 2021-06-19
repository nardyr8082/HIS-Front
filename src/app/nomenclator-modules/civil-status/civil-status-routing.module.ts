import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CivilStatusPageComponent } from './pages/civil-status-page/civil-status-page.component';
import { LayoutComponent } from '../../shared/layout/layout.component';

const routes: Routes = [{
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: CivilStatusPageComponent
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CivilStatusRoutingModule { }
