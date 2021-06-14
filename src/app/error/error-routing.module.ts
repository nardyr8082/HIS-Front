import { ForbiddenAccessComponent } from './forbidden-access/forbidden-access.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorLayoutComponent } from './error-layout/error-layout.component';
import { NotFoundErrorComponent } from './404/not-found-error.component';
import { LostConnectionComponent } from './lost-connection/lost-connection.component';

const routes: Routes = [
  {
    path: '',
    component: ErrorLayoutComponent,
    children: [
      {
        path: '404',
        component: NotFoundErrorComponent,
      },
      {
        path: '403',
        component: ForbiddenAccessComponent,
      },
      {
        path: 'lost-connection',
        component: LostConnectionComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorRoutingModule {}
