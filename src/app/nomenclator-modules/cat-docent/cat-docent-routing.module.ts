import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatDocentPageComponent } from './pages/cat-docent-page/cat-docent-page.component';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: CatDocentPageComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatDocentRoutingModule { }
