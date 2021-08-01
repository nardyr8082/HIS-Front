import { TraceActionsModule } from './security-module/trace-actions/trace-actions.module';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { BackendGuard } from './backend/backend.guard';
import { Route } from '@angular/compiler/src/core';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../app/authentication/authentication.module').then((m) => m.AuthenticationModule),
        canActivate: [AuthenticationGuard],
      },
      {
        path: 'authentication',
        loadChildren: () => import('../app/authentication/authentication.module').then((m) => m.AuthenticationModule),
        canActivate: [AuthenticationGuard],
      },
      {
        path: 'backend',
        loadChildren: () => import('../app/backend/backend.module').then((m) => m.BackendModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'error',
        loadChildren: () => import('../app/error/error.module').then((m) => m.ErrorModule),
      },
      {
        path: 'org-level',
        loadChildren: () => import('./structure-modules/org-level/org-level.module').then((m) => m.OrgLevelModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'office',
        loadChildren: () => import('./structure-modules/office/office.module').then((m) => m.OfficeModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'trace-actions',
        loadChildren: () => import('./security-module/trace-actions/trace-actions.module').then((m) => m.TraceActionsModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'trace-access',
        loadChildren: () => import('./security-module/trace-access/trace-access.module').then((m) => m.TraceAccessModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'municipality',
        loadChildren: () => import('./nomenclator-modules/municipality/municipality.module').then((m) => m.MunicipalityModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'cat-science',
        loadChildren: () => import('./nomenclator-modules/cat-science/cat-science.module').then((m) => m.CatScienceModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'cat-docent',
        loadChildren: () => import('./nomenclator-modules/cat-docent/cat-docent.module').then((m) => m.CatDocentModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'doc-type-id',
        loadChildren: () => import('./nomenclator-modules/doc-type-id/doc-type-id.module').then((m) => m.DocTypeIdModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'gender',
        loadChildren: () => import('./nomenclator-modules/gender/gender.module').then((m) => m.GenderModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'blood-type',
        loadChildren: () => import('./nomenclator-modules/blood-type/blood-type.module').then((m) => m.BloodTypeModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'specialty',
        loadChildren: () => import('./nomenclator-modules/specialty/specialty.module').then((m) => m.SpecialtyModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'profession',
        loadChildren: () => import('./nomenclator-modules/profession/profession.module').then((m) => m.ProfessionModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'country',
        loadChildren: () => import('./nomenclator-modules/country/country.module').then((m) => m.CountryModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'nationality',
        loadChildren: () => import('./nomenclator-modules/nationality/nationality.module').then((m) => m.NationalityModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'state',
        loadChildren: () => import('./nomenclator-modules/state/state.module').then((m) => m.StateModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'race',
        loadChildren: () => import('./nomenclator-modules/race/race.module').then((m) => m.RaceModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'roles',
        loadChildren: () => import('./security-module/role/role.module').then((m) => m.RoleModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'civil_status',
        loadChildren: () => import('./nomenclator-modules/civil-status/civil-status.module').then((m) => m.CivilStatusModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'user',
        loadChildren: () => import('./security-module/user/user.module').then((m) => m.UserModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'work-station',
        loadChildren: () => import('./structure-modules/work-station/work-station.module').then((m) => m.WorkStationModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'health-unit',
        loadChildren: () => import('./structure-modules/health-unit/health-unit.module').then((m) => m.HealthUnitModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'configurations',
        loadChildren: () => import('./configurations/configurations.module').then((m) => m.ConfigurationsModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'clinical-services',
        loadChildren: () => import('./clinical-services/clinical-services.module').then((m) => m.ClinicalServicesModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'clinic-history-static',
        loadChildren: () => import('./clinical-services/clinic-history-static/clinic-history-static.module').then((m) => m.ClinicHistoryStaticModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'system-manager',
        loadChildren: () => import('./clinical-services/systemmanager/systemmanager.module').then((m) => m.SystemmanagerModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'clinic-register',
        loadChildren: () => import('./clinical-services/register/register.module').then((m) => m.RegisterModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'clinic-test',
        loadChildren: () => import('./clinical-services/physicalexam/physicalexam.module').then((m) => m.PhysicalexamModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'clinic-entry',
        loadChildren: () => import('./clinical-services/entry/entry.module').then((m) => m.EntryModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'stock-box',
        loadChildren: () => import('./stock-modules/boxstock/boxstock.module').then((m) => m.BoxstockModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'stock-stock',
        loadChildren: () => import('./stock-modules/stock/stock.module').then((m) => m.StockModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'return-suplier',
        loadChildren: () => import('./stock-modules/suplierreturn/suplierreturn.module').then((m) => m.SuplierreturnModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'stock-tax',
        loadChildren: () => import('./stock-modules/classifiers/tax/tax.module').then((m) => m.TaxModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'stock-measure',
        loadChildren: () => import('./stock-modules/classifiers/measure/measure.module').then((m) => m.MeasureModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'provider',
        loadChildren: () => import('./stock-modules/classifiers/provider/provider.module').then((m) => m.ProviderModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'stock-program',
        loadChildren: () => import('./stock-modules/classifiers/program/program.module').then((m) => m.ProgramModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'stock-inventory',
        loadChildren: () => import('./stock-modules/inventorys/inventorys.module').then((m) => m.InventorysModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'stock-services',
        loadChildren: () => import('./stock-modules/servicesstock/servicesstock.module').then((m) => m.ServicesstockModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'stock-product',
        loadChildren: () => import('./stock-modules/productstock/productstock.module').then((m) => m.ProductstockModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'change-price',
        loadChildren: () => import('./stock-modules/pricechanges/pricechanges.module').then((m) => m.PricechangesModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'attribute',
        loadChildren: () => import('./stock-modules/classifiers/attribute/attribute.module').then((m) => m.AttributeModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'stock-commercial-operation',
        loadChildren: () => import('./stock-modules/classifiers/commercial-operation/commercial-operation.module').then((m) => m.CommercialOperationModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'stock-product-category',
        loadChildren: () => import('./stock-modules/classifiers/product-category/product-category.module').then((m) => m.ProductCategoryModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'stock-invoice-status',
        loadChildren: () => import('./stock-modules/classifiers/invoice-status/invoice-status.module').then((m) => m.InvoiceStatusModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'indicator',
        loadChildren: () => import('./indicator-module/indicator/indicator.module').then((m) => m.IndicatorModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'indicator-category',
        loadChildren: () => import('./indicator-module/classifiers/category/category.module').then((m) => m.CategoryModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'indicator-subcategory',
        loadChildren: () => import('./indicator-module/classifiers/subcategory/subcategory.module').then((m) => m.SubcategoryModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'indicator-frequency',
        loadChildren: () => import('./indicator-module/classifiers/frequency/frequency.module').then((m) => m.FrequencyModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'move-type',
        loadChildren: () => import('./stock-modules/classifiers/move-type/move-type.module').then((m) => m.MoveTypeModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'lotwarehouse',
        loadChildren: () => import('./stock-modules/warehouse-lot/warehouse-lot.module').then((m) => m.WarehouseLotModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'warehouse-inventory-difference',
        loadChildren: () =>
          import('./stock-modules/warehouse-inventory-difference/warehouse-inventory-difference.module').then((m) => m.WarehouseInventoryDifferenceModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'existence',
        loadChildren: () => import('./stock-modules/existence/existence.module').then((m) => m.ExistenceModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'warehouse-movement-detail',
        loadChildren: () => import('./stock-modules/warehouse-movement-detail/warehouse-movement-detail.module').then((m) => m.WarehouseMovementDetailModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'stock-invetory-status',
        loadChildren: () => import('./stock-modules/classifiers/inventory-status/inventory-status.module').then((m) => m.InventoryStatusModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'move-status',
        loadChildren: () => import('./stock-modules/classifiers/move-status/move-status.module').then((m) => m.MoveStatusModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'diseases',
        loadChildren: () => import('./clinical-services/disease/disease.module').then((m) => m.DiseaseModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'indicator-type',
        loadChildren: () => import('./indicator-module/indicator-type/indicator-type.module').then((m) => m.IndicatorTypeModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'variable-indicator',
        loadChildren: () => import('./indicator-module/variable-indicator/variable-indicator.module').then((m) => m.VariableIndicatorModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'inventory-count',
        loadChildren: () => import('./stock-modules/inventory/inventory-count/inventory-count.module').then((m) => m.InventoryCountModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'subprogram',
        loadChildren: () => import('./indicator-module/classifiers/subprogram/subprogram.module').then((m) => m.SubprogramModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'facture',
        loadChildren: () => import('./stock-modules/facture/facture.module').then((m) => m.FactureModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'sale',
        loadChildren: () => import('./stock-modules/sale/sale.module').then((m) => m.SaleModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'sale-facture',
        loadChildren: () => import('./stock-modules/sale-facture/sale-facture.module').then((m) => m.SaleFactureModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'purchase',
        loadChildren: () => import('./stock-modules/purchase/purchase.module').then((m) => m.PurchaseModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'purchase-facture',
        loadChildren: () => import('./stock-modules/purchase-facture/purchase-facture.module').then((m) => m.PurchaseFactureModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'diagnostic',
        loadChildren: () => import('./clinical-services/diagnostic/diagnostic.module').then((m) => m.DiagnosticModule),
        canActivate: [BackendGuard],
      },
      // Resources
      {
        path: 'resource-status',
        loadChildren: () => import('./resources-modules/status/resource-status.module').then((m) => m.ResourceStatusModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'resource-self',
        loadChildren: () => import('./resources-modules/aftselfresources/aftselfresources.module').then((m) => m.AftselfresourcesModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'resource-type',
        loadChildren: () => import('./resources-modules/type/type.module').then((m) => m.ResourceTypeModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'resource-clasificator',
        loadChildren: () => import('./resources-modules/classificator/classificator.module').then((m) => m.ClassificatorModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'stock-product-family',
        loadChildren: () => import('./stock-modules/classifiers/product-family/product-family.module').then((m) => m.ProductFamilyModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'patient',
        loadChildren: () => import('./patient/patient.module').then((m) => m.PatientModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'stock-state-appointment',
        loadChildren: () => import('./stock-modules/stock-state-appointment/stock-state-appointment.module').then((m) => m.StockStateAppointmentModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'warehouse-received-transfer',
        loadChildren: () =>
          import('./stock-modules/warehouse-received-transfer/warehouse-received-transfer.module').then((m) => m.WarehouseReceivedTransferModule),
        canActivate: [BackendGuard],
      },

      {
        path: 'batch-distribution',
        loadChildren: () => import('./stock-modules/batch-distribution/batch-distribution.module').then((m) => m.BatchDistributionModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'facture-service',
        loadChildren: () => import('./stock-modules/facture-service/facture-service.module').then((m) => m.FactureServiceModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'transfer-emited',
        loadChildren: () => import('./stock-modules/transfer-emited-stock/transfer-emited-stock.module').then((m) => m.TransferEmitedStockModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'treatment-indications',
        loadChildren: () => import('./clinical-services/treatment-indications/treatment-indications.module').then((m) => m.TreatmentIndicationsModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'treatment-executions',
        loadChildren: () => import('./clinical-services/treatment-executions/treatment-executions.module').then((m) => m.TreatmentExecutionsModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'moves',
        loadChildren: () => import('./stock-modules/stock-moves/stock-moves.module').then((m) => m.StockMovesModule),
        canActivate: [BackendGuard],
      },
      {
        path: 'appointment',
        loadChildren: () => import('./clinical-services/appointment/appointment.module').then((m) => m.AppointmentModule),
        canActivate: [BackendGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export const routing: ModuleWithProviders<Route> = RouterModule.forRoot(routes);

@NgModule({
  imports: [routing],
  exports: [RouterModule],
})
export class AppRoutingModule {}
