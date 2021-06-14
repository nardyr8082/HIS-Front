import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  MailOriginTableComponent
} from './mail-origin-table/mail-origin-table.component';

const routes: Routes = [{
    path: '',
    component: MailOriginTableComponent,
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
export class MailOriginRoutingModule {}