import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemmanagerPageComponent } from './pages/systemmanager-page/systemmanager-page.component';
import { SystemmanagerFormComponent } from './components/systemmanager-form/systemmanager-form.component';
import { SystemmanagerRoutingModule } from './systemmanager-routing.module';



@NgModule({
  declarations: [ SystemmanagerPageComponent,  SystemmanagerFormComponent],
  imports: [CommonModule,  SystemmanagerRoutingModule, SharedModule],
  entryComponents: [ SystemmanagerFormComponent],
})
export class SystemmanagerModule {}
