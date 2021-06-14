import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  MailTemplateTableComponent
} from './mail-template-table/mail-template-table.component';

const routes: Routes = [{
    path: '',
    component: MailTemplateTableComponent,
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
export class MailTemplateRoutingModule {}