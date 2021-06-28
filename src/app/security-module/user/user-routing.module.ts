import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { UserItemComponent } from './pages/user-item/user-item.component';
import { UserPageComponent } from './pages/user-page/user-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: UserPageComponent,
      },
      {
        path: 'create',
        component: UserItemComponent,
      },
      {
        path: 'edit/:id',
        component: UserItemComponent,
      },
      {
        path: 'details/:id',
        component: UserDetailsComponent,
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
export class UserRoutingModule {}
