import { StockMovesPageComponent } from './pages/stock-moves-page/stock-moves-page.component';
import { StockMovesItemComponent } from './pages/stock-moves-item/stock-moves-item.component';
import { LayoutComponent } from '../../shared/layout/layout.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: StockMovesPageComponent,
      },
      {
        path: 'create',
        component: StockMovesItemComponent,
      },
      {
        path: 'edit/:id',
        component: StockMovesItemComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockMoveRoutingModule {}
