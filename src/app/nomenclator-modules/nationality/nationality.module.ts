import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NationalityPageComponent } from './pages/nationality-page/nationality-page.component';
import { NationalityRoutingModule } from './nationality-routing.module';
import { NationalityFormComponent } from './components/nationality-form/nationality-form.component';

@NgModule({
  declarations: [NationalityPageComponent, NationalityFormComponent],
  imports: [CommonModule, SharedModule, NationalityRoutingModule],
  entryComponents: [NationalityFormComponent],
})
export class NationalityModule {}
