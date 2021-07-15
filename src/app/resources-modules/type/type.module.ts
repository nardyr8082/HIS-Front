import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeRoutingModule } from './type-routing.module';
import { TypePageComponent } from './pages/type-page/type-page.component';
import { ResourceTypeFormComponent } from './components/type-form/type-form.component';

@NgModule({
  declarations: [TypePageComponent, ResourceTypeFormComponent],
  imports: [CommonModule, TypeRoutingModule, SharedModule],
  entryComponents: [ResourceTypeFormComponent],
})
export class ResourceTypeModule {}
