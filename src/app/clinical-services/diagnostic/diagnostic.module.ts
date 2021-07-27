import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagnosticPageComponent } from './pages/diagnostic-page/diagnostic-page.component';
import { DiagnosticRoutingModule } from './diagnostic-routing.module';
import { DiagnosticFormComponent } from './components/diagnostic-form/diagnostic-form.component';

@NgModule({
  declarations: [DiagnosticFormComponent, DiagnosticPageComponent],
  imports: [CommonModule, DiagnosticRoutingModule, SharedModule],
  entryComponents: [DiagnosticFormComponent],
})
export class DiagnosticModule {}
