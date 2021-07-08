import { ClinicalServicesRoutingModule } from './clinical-services-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableNomenclatorPageComponent } from './pages/dynamic-table-nomenclator-page/dynamic-table-nomenclator-page.component';
import { DynamicTableNomenclatorFormComponent } from './components/dynamic-table-nomenclator-form/dynamic-table-nomenclator-form.component';
import { SharedModule } from '../shared/shared.module';
import { DynamicTableFormComponent } from './components/dynamic-table-form/dynamic-table-form.component';
import { DynamicTablePageComponent } from './pages/dynamic-table-page/dynamic-table-page.component';
import { DynamicTableItemPageComponent } from './pages/dynamic-table-item-page/dynamic-table-item-page.component';
import { ClinicHistoryPageComponent } from './pages/clinic-history-page/clinic-history-page.component';
import { ClinicHistoryFormComponent } from './components/clinic-history-form/clinic-history-form.component';
import { ClinicHistoryItemComponent } from './pages/clinic-history-item/clinic-history-item.component';

@NgModule({
  declarations: [DynamicTableNomenclatorPageComponent, DynamicTableNomenclatorFormComponent, DynamicTableFormComponent, DynamicTablePageComponent, DynamicTableItemPageComponent, ClinicHistoryPageComponent, ClinicHistoryFormComponent, ClinicHistoryItemComponent],
  imports: [CommonModule, ClinicalServicesRoutingModule, SharedModule],
  entryComponents: [DynamicTableNomenclatorFormComponent],
})
export class ClinicalServicesModule {}
