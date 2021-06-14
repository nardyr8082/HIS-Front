import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {SendMailTestingComponent} from "./send-mail-testing/send-mail-testing.component";


const routes: Routes = [{
    path: '',
    component: SendMailTestingComponent,
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
export class SendMailRoutingModule {}
