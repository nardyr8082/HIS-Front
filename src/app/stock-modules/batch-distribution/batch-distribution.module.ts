import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchDistributionPageComponent } from './page/batch-distribution-page/batch-distribution-page.component';
import { BatchDistributionFormComponent } from './components/batch-distribution-form/batch-distribution-form.component';
import { BatchDistributionRoutingModule } from './batch-distribution-routing.module';

@NgModule({
  declarations: [BatchDistributionPageComponent, BatchDistributionFormComponent],
  imports: [CommonModule, BatchDistributionRoutingModule, SharedModule],
  entryComponents: [BatchDistributionFormComponent],
  exports: [BatchDistributionPageComponent, BatchDistributionFormComponent],
})
export class BatchDistributionModule {}
