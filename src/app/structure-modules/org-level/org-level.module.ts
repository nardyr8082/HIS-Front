import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgLevelPageComponent } from './pages/org-level-page/org-level-page.component';
import { OrgLevelRoutingModule } from './org-level-routing.module';
import { OrgLevelFormComponent } from './components/org-level-form/org-level-form.component';

@NgModule({
  declarations: [OrgLevelFormComponent, OrgLevelPageComponent],
  imports: [CommonModule, OrgLevelRoutingModule, SharedModule],
  entryComponents: [OrgLevelFormComponent],
})
export class OrgLevelModule {}
