import { SharedModule } from './../../../shared/shared.module';
import { MoveTypeRoutingModule } from './move-type-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoveTypePageComponent } from './page/move-type-page/move-type-page.component';
import { MoveTypeFormComponent } from './components/move-type-form/move-type-form.component';

@NgModule({
  declarations: [MoveTypePageComponent, MoveTypeFormComponent],
  imports: [CommonModule, MoveTypeRoutingModule, SharedModule],
  entryComponents: [MoveTypeFormComponent],
})
export class MoveTypeModule {}
