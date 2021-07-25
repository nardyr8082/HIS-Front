import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuplierreturnFormComponent } from './components/suplierreturn-form/suplierreturn-form.component';
import { SuplierreturnRoutingModule } from './suplierreturn-routing.module';
import { SuplierreturnPageComponent } from './pages/suplierreturn-page/suplierreturn-page.component';



@NgModule({
  declarations: [SuplierreturnPageComponent, SuplierreturnFormComponent],
  imports: [CommonModule, SuplierreturnRoutingModule, SharedModule],
  entryComponents: [SuplierreturnFormComponent],
})
export class SuplierreturnModule {}
