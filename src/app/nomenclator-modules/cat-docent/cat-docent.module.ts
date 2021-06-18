import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatDocentRoutingModule } from './cat-docent-routing.module';
import { CatDocentPageComponent } from './pages/cat-docent-page/cat-docent-page.component';
import { CatDocentFormComponent } from './components/cat-docent-form/cat-docent-form.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [CatDocentPageComponent, CatDocentFormComponent],
  imports: [
    CommonModule,
    CatDocentRoutingModule,
    SharedModule
  ],
  entryComponents:[CatDocentFormComponent]
})
export class CatDocentModule { }
