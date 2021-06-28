import { UserPageComponent } from './pages/user-page/user-page.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserItemComponent } from './pages/user-item/user-item.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { UserDetailsComponent } from './pages/user-details/user-details.component';

@NgModule({
  declarations: [UserItemComponent, UserFormComponent, UserPageComponent, UserDetailsComponent],
  imports: [CommonModule, SharedModule, UserRoutingModule],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class UserModule {}
