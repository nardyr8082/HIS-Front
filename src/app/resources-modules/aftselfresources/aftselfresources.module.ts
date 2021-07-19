import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AftselfresourcesPageComponent } from './pages/aftselfresources-page/aftselfresources-page.component';
import { AftselfresourcesRoutingModule } from './aftselfresources-routing.module';
import { AftselfresourcesFormComponent } from './components/aftselfresources-form/aftselfresources-form.component';

@NgModule({
  declarations: [AftselfresourcesPageComponent, AftselfresourcesFormComponent],
  imports: [CommonModule, AftselfresourcesRoutingModule, SharedModule],
  entryComponents: [AftselfresourcesFormComponent],
})
export class AftselfresourcesModule {}
