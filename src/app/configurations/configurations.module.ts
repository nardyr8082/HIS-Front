import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationsRoutingModule } from './configurations-routing.module';
import { ConfigurationsComponent } from './components/configurations/configurations.component';
import { SharedModule } from '../shared/shared.module';
import { ConfigurationPageComponent } from './pages/configuration-page/configuration-page.component';

@NgModule({
  declarations: [ConfigurationsComponent, ConfigurationPageComponent],
  imports: [CommonModule, ConfigurationsRoutingModule, SharedModule],
})
export class ConfigurationsModule {}
