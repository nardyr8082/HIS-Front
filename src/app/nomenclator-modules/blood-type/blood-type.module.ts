import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BloodTypeRoutingModule } from './blood-type-routing.module';
import { BloodTypePageComponent } from './pages/blood-type-page/blood-type-page.component';
import { BloodTypeFormComponent } from './components/blood-type-form/blood-type-form.component';

@NgModule({
  declarations: [BloodTypePageComponent, BloodTypeFormComponent],
  imports: [CommonModule, BloodTypeRoutingModule, SharedModule],
  entryComponents: [BloodTypeFormComponent],
})
export class BloodTypeModule {}
