import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeasureRoutingModule } from './measure-routing.module';
import { MeasurePageComponent } from './pages/measure-page/measure-page.component';
import { MeasureFormComponent } from './components/measure-form/measure-form.component';

@NgModule({
  declarations: [MeasurePageComponent, MeasureFormComponent],
  imports: [CommonModule, MeasureRoutingModule, SharedModule],
  entryComponents: [MeasureFormComponent],
})
export class MeasureModule {}
