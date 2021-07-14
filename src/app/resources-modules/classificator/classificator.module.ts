import { ClasificatorRoutingModule } from './clasificator-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClasificatorPageComponent } from './pages/clasificator-page/clasificator-page.component';
import { ClasificatorFormComponent } from './components/clasificator-form/clasificator-form.component';

@NgModule({
  declarations: [ClasificatorPageComponent, ClasificatorFormComponent],
  imports: [CommonModule, ClasificatorRoutingModule, SharedModule],
  entryComponents: [ClasificatorFormComponent],
})
export class ClassificatorModule {}
