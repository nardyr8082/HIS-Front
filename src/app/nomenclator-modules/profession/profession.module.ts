import { ProfessionPageComponent } from './pages/profession-page/profession-page.component';
import { ProfessionFormComponent } from './components/profession-form/profession-form.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionRoutingModule } from './profession-routing.module';

@NgModule({
  declarations: [ProfessionFormComponent, ProfessionPageComponent],
  imports: [CommonModule, ProfessionRoutingModule, SharedModule],
  entryComponents: [ProfessionFormComponent],
})
export class ProfessionModule {}
