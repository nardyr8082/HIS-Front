import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleFormComponent } from './components/role-form/role-form.component';
import { RolePageComponent } from './pages/role-page/role-page.component';
import { RoleRoutingModule } from './role-routing.module';

@NgModule({
  declarations: [RoleFormComponent, RolePageComponent],
  imports: [CommonModule, RoleRoutingModule, SharedModule],
  entryComponents: [RoleFormComponent],
})
export class RoleModule {}
