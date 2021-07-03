import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfficePageComponent } from './pages/office-page/office-page.component';
import { OfficeRoutingModule } from './office-routing.module';
import { OfficeFormComponent } from './components/office-form/office-form.component';

@NgModule({
  declarations: [OfficeFormComponent, OfficePageComponent],
  imports: [CommonModule, OfficeRoutingModule, SharedModule],
  entryComponents: [OfficeFormComponent],
})
export class OfficeModule {}
