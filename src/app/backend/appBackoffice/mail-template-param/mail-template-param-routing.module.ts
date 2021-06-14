import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  MailTemplateParamTableComponent
} from './mail-template-param-table/mail-template-param-table.component';

const routes: Routes = [{
    path: '',
    component: MailTemplateParamTableComponent,
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
export class MailTemplateParamRoutingModule {}