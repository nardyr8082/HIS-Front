import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MunicipalityPageComponent } from './components/municipality-page/municipality-page.component';
import { MunicipalityRoutingModule } from './municipality-routing.module';

@NgModule({
  declarations: [MunicipalityPageComponent],
  imports: [CommonModule, SharedModule, MunicipalityRoutingModule],
})
export class MunicipalityModule {}
