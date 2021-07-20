import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExistenceRoutingModule } from './existence-routing.module';
import { ExistenceFormComponent } from './components/existence-form/existence-form.component';
import { ExistencePageComponent } from './pages/existence-page/existence-page.component';


@NgModule({
  declarations: [ExistenceFormComponent, ExistencePageComponent],
  imports: [
    CommonModule,
    ExistenceRoutingModule,
    SharedModule
  ],
  entryComponents: [ExistenceFormComponent],
})
export class ExistenceModule { }
