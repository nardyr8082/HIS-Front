import { PatientDetailsComponent } from './pages/patient-details/patient-details.component';
import { PatientItemComponent } from './pages/patient-item/patient-item.component';
import { PatientPageComponent } from './pages/patient-page/patient-page.component';
import { LayoutComponent } from './../shared/layout/layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: PatientPageComponent,
      },
      {
        path: 'create',
        component: PatientItemComponent,
      },
      {
        path: 'edit/:id',
        component: PatientItemComponent,
      },
      {
        path: 'details/:id',
        component: PatientDetailsComponent,
      },
    ],
  },
  // {
  //   path: '**',
  //   redirectTo: 'product'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientRoutingModule {}
