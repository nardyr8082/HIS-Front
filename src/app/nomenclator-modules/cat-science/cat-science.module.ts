import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatSciencePageComponent } from './pages/cat-science-page/cat-science-page.component';
import { CatScienceRoutingModule } from './cat-science-routing.module';
import { CatScienceFormComponent } from './components/cat-science-form/cat-science-form.component';

@NgModule({
  declarations: [CatSciencePageComponent, CatScienceFormComponent],
  imports: [CommonModule, SharedModule, CatScienceRoutingModule],
  entryComponents: [CatScienceFormComponent],
})
export class CatScienceModule {}
