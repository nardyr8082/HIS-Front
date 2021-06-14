import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  LanguageInfoTableComponent
} from './language-info-table/language-info-table.component';

const routes: Routes = [{
    path: '',
    component: LanguageInfoTableComponent,
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
export class LanguageInfoRoutingModule {}