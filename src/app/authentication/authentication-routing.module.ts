import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LoginComponent } from './login/login.component';
import { EmailForgotComponent } from './email-forgot-pass/email-forgot-pass.component';
import { ChangePassAuthComponent } from './change-pass-auth/change-pass-auth.component';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: LoginComponent,
      },
      {
        path: 'login',
        pathMatch: 'full',
        component: LoginComponent,
      },
      {
        path: 'email-forgot',
        component: EmailForgotComponent,
      },
      {
        path: 'change-pass',
        component: ChangePassAuthComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
