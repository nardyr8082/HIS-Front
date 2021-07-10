import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderPageComponent } from './pages/provider-page/provider-page.component';
import { ProviderFormComponent } from './components/provider-form/provider-form.component';
import { ProvierRoutingModule } from './provider-routing.module';

@NgModule({
  declarations: [ProviderPageComponent, ProviderFormComponent],
  imports: [CommonModule, ProvierRoutingModule, SharedModule],
  entryComponents: [ProviderFormComponent],
})
export class ProviderModule {}
