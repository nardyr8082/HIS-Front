import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  AttachedToMailTableComponent
} from './attached-to-mail-table/attached-to-mail-table.component';

const routes: Routes = [{
    path: '',
    component: AttachedToMailTableComponent,
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttachedToMailRoutingModule {}