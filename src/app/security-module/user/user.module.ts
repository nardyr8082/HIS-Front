import { UserPageComponent } from './pages/user-page/user-page.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserItemComponent } from './pages/user-item/user-item.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [UserItemComponent, UserFormComponent, UserPageComponent],
  imports: [CommonModule, SharedModule, UserRoutingModule],
})
export class UserModule {}
