import { ResourceStatusPageComponent } from './pages/resource-status-page/resource-status-page.component';
import { ResourceStatusRoutingModule } from './resource-status-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceStatusFormComponent } from './components/resource-status-form/resource-status-form.component';

@NgModule({
  declarations: [ResourceStatusPageComponent, ResourceStatusFormComponent],
  imports: [CommonModule, ResourceStatusRoutingModule, SharedModule],
  entryComponents: [ResourceStatusFormComponent],
})
export class ResourceStatusModule {}
