import { ToastrService } from 'ngx-toastr';
import { CategoryService } from './../../../../indicator-module/classifiers/category/services/category.service';
import { MoveTypeService } from './../../../classifiers/move-type/services/moveType.service';
import { ProductCategoryService } from './../../../classifiers/product-category/services/product-category.service';
import { StockService } from './../../../boxstock/services/stock.service';
import { MoveType } from './../../../classifiers/move-type/models/move-type.model';
import { ProductCategory } from './../../../classifiers/product-category/models/product-category.model';
import { Subscription, Observable, of } from 'rxjs';
import { StockMoveService } from './../../services/stock-move.service';
import { StockMove } from './../../models/stock-move.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Stock } from 'src/app/stock-modules/boxstock/models/boxstock.model';

@Component({
  selector: 'app-stock-moves-item',
  templateUrl: './stock-moves-item.component.html',
  styleUrls: ['./stock-moves-item.component.scss'],
})
export class StockMovesItemComponent implements OnInit, OnDestroy {
  stockMove: StockMove;
  stocks$: Observable<Stock[]>;
  categories$: Observable<ProductCategory[]>;
  moveTypes$: Observable<MoveType[]>;

  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private stockMoveService: StockMoveService,
    private stockService: StockService,
    private productCategoryService: ProductCategoryService,
    private moveTypeService: MoveTypeService,
    private toastrService: ToastrService,
  ) {
    this.route.params.subscribe((params) => {
      const stockMoveId = params['id'];
      if (stockMoveId) {
        const sub = this.stockMoveService
          .getStockMoveById(stockMoveId)
          .pipe(
            map((response) => {
              this.stockMove = response;
            }),
          )
          .subscribe();

        this.subscriptions.push(sub);
      }
    });
  }

  ngOnInit(): void {
    this.getStocks();
    this.getCategories();
    this.getMoveTypes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getStocks() {
    this.stocks$ = this.stockService.getStock({}, 'id', 'asc', 1, 10000).pipe(map((response) => response.results));
  }

  getCategories() {
    this.categories$ = this.productCategoryService.getProductCategorys({}, 'id', 'asc', 1, 10000).pipe(map((response) => response.results));
  }

  getMoveTypes() {
    this.moveTypes$ = this.moveTypeService.getMoveTypes({}, 'id', 'asc', 1, 10000).pipe(map((response) => response.results));
  }
}
