import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryPageComponent } from './pages/entry-page/entry-page.component';
import { EntryRoutingModule } from './entry-routing.module';
import { EntryFormComponent } from './components/entry-form/entry-form.component';



@NgModule({
  declarations: [EntryFormComponent, EntryPageComponent],
  imports: [CommonModule, EntryRoutingModule, SharedModule],
  entryComponents: [EntryFormComponent],
})
export class EntryModule {}
