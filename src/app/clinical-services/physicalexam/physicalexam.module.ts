import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhysicalexamFormComponent } from './components/physicalexam-form/physicalexam-form.component';
import { PhysicalexamRoutingModule } from './physicalexam-routing.module';
import { PhysicalexamPageComponent } from './pages/physicalexam-page/physicalexam-page.component';




@NgModule({
  declarations: [PhysicalexamFormComponent, PhysicalexamPageComponent],
  imports: [CommonModule, PhysicalexamRoutingModule, SharedModule],
  entryComponents: [PhysicalexamFormComponent],
})
export class PhysicalexamModule {}
