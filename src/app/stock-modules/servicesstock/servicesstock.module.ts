import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { ServicesstockFormComponent } from './components/servicesstock-form/servicesstock-form.component';
import { ServicesstockRoutingModule } from './servicesstock-routing.module';
import { ServicesstockPageComponent } from './pages/servicesstock-page/servicesstock-page.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [ServicesstockFormComponent, ServicesstockPageComponent],
  imports: [CommonModule, ServicesstockRoutingModule, SharedModule],
  entryComponents: [ServicesstockFormComponent],
})
export class ServicesstockModule {}
