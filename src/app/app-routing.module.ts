import { TraceActionsModule } from './security-module/trace-actions/trace-actions.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { BackendGuard } from './backend/backend.guard';

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
        path: 'specialty',
        loadChildren: () => import('./nomenclator-modules/specialty/specialty.module').then((m) => m.SpecialtyModule),
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
    ],
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
