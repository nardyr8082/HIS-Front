import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../shared/layout/layout.component';
import { DashboardComponent } from '../backend/appBackoffice/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
        // loadChildren: () => import('./appBackoffice/admin-users/admin-users.module').then((m) => m.AdminUsersModule),
      },
      {
        path: 'users',
        loadChildren: () => import('./appBackoffice/admin-users/admin-users.module').then((m) => m.AdminUsersModule),
      },
      {
        path: 'perfil',
        loadChildren: () => import('./appBackoffice/profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'mail-template-param',
        loadChildren: () => import('./appBackoffice/mail-template-param/mail-template-param.module').then((m) => m.MailTemplateParamModule),
      },
      {
        path: 'mail-template',
        loadChildren: () => import('./appBackoffice/mail-template/mail-template.module').then((m) => m.MailTemplateModule),
      },
      {
        path: 'mail-origin',
        loadChildren: () => import('./appBackoffice/mail-origin/mail-origin.module').then((m) => m.MailOriginModule),
      },
      {
        path: 'attached-mail',
        loadChildren: () => import('./appBackoffice/attached-to-mail/attached-to-mail.module').then((m) => m.AttachedToMailModule),
      },
      {
        path: 'business',
        loadChildren: () => import('./appBackoffice/business/business.module').then((m) => m.BusinessModule),
      },
      {
        path: 'language',
        loadChildren: () => import('./appBackoffice/language-info/language-info.module').then((m) => m.LanguageInfoModule),
      },
      {
        path: 'send-mail-testing',
        loadChildren: () => import('./appBackoffice/send-mail/send-mail.module').then((m) => m.SendMailModule),
      },
      {
        path: 'error',
        loadChildren: () => import('../error/error.module').then((m) => m.ErrorModule),
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
export class BackendRoutingModule {}
