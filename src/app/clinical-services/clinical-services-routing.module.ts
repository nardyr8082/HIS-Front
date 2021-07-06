import { DynamicTableItemPageComponent } from './pages/dynamic-table-item-page/dynamic-table-item-page.component';
import { DynamicTablePageComponent } from './pages/dynamic-table-page/dynamic-table-page.component';
import { DynamicTableNomenclatorPageComponent } from './pages/dynamic-table-nomenclator-page/dynamic-table-nomenclator-page.component';
import { LayoutComponent } from './../shared/layout/layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'meta-field',
        component: DynamicTableNomenclatorPageComponent,
      },
      {
        path: 'meta-table',
        component: DynamicTablePageComponent,
      },
      {
        path: 'meta-table/create',
        component: DynamicTableItemPageComponent,
      },
      {
        path: 'meta-table/edit/:id',
        component: DynamicTableItemPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClinicalServicesRoutingModule {}
