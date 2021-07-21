import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubprogramPageComponent } from './pages/subprogram-page/subprogram-page.component';
import { SubprogramRoutingModule } from './subprogram-routing.module';
import { SubprogramFormComponent } from './components/subprogram-form/subprogram-form.component';

@NgModule({
  declarations: [SubprogramFormComponent, SubprogramPageComponent],
  imports: [CommonModule, SubprogramRoutingModule, SharedModule],
  entryComponents: [SubprogramFormComponent],
})
export class SubprogramModule {}
