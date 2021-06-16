import { TraceActionsPageComponent } from './pages/trace-actions-page/trace-actions-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../shared/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: TraceActionsPageComponent,
      },
    ],
  },
  // {
  //   path: '**',
  //   redirectTo: 'product'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TraceActionsRoutingModule {}
