import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgLevelFormComponent } from './components/org-level-form/org-level-form.component';
import { OrgLevelPageComponent } from './pages/org-level-page/org-level-page.component';
import { OrgLevelRoutingModule } from './org-level-routing.module';

@NgModule({
  declarations: [OrgLevelFormComponent, OrgLevelPageComponent],
  imports: [CommonModule, OrgLevelRoutingModule, SharedModule],
})
export class RoleModule {}
