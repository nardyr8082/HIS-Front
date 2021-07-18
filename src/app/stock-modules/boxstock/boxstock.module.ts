import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxstockPageComponent } from './pages/boxstock-page/boxstock-page.component';
import { BoxstockFormComponent } from './components/boxstock-form/boxstock-form.component';
import { BoxstockRoutingModule } from './boxstock-routing.module';


@NgModule({
  declarations: [BoxstockPageComponent, BoxstockFormComponent],
  imports: [CommonModule, BoxstockRoutingModule, SharedModule],
  entryComponents: [BoxstockFormComponent],
})
export class BoxstockModule {}
