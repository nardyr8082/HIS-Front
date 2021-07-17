import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlmacencajaFormComponent } from './components/almacencaja-form/almacencaja-form.component';
import { AlmacencajaRoutingModule } from './almacencaja-routing.module';
import { AlmacencajaPageComponent } from './pages/almacencaja-page/almacencaja-page.component';

@NgModule({
  declarations: [AlmacencajaPageComponent, AlmacencajaFormComponent],
  imports: [CommonModule, AlmacencajaRoutingModule, SharedModule],
  entryComponents: [AlmacencajaFormComponent],
})
export class AlmacencajaModule {}
