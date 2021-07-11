import { ProductCategoryService } from '../../services/product-category.service';
import { PRODUCT_CATEGORY_TABLE_CONFIGURATION } from '../../models/product-category-table-configuration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { ProductCategory } from '../../models/product-category.model';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductCategoryFormComponent } from '../../components/product-category-form/product-category-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-product-category-page',
  templateUrl: './product-category-page.component.html',
  styleUrls: ['./product-category-page.component.scss'],
})
export class ProductCategoryPageComponent implements OnInit, OnDestroy {
  productCategories: ProductCategory[];
  dataCount = 0;
  configuration = PRODUCT_CATEGORY_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Categoría Producto',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Categoría Producto',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteProductCategory(item),
    },
  ];

  constructor(private productCategoryService: ProductCategoryService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getProductCategorys();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getProductCategorys(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.productCategoryService
      .getProductCategorys(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<ProductCategory>) => {
          this.productCategories = response.results;
          this.dataCount = response.count;
          this.loading = false;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los datos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          this.loading = false;
          return null;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getProductCategorys(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getProductCategorys(filters, 'id', 'desc');
  }

  createProductCategory() {
    let dialogRef: MatDialogRef<ProductCategoryFormComponent, any>;

    dialogRef = this.dialog.open(ProductCategoryFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        productCategory: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ProductCategoryFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((productCategory: ProductCategory) =>
          this.productCategoryService.createProductCategory(productCategory).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la categoría producto. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getProductCategorys(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La categoría producto fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<ProductCategoryFormComponent, any>;

    dialogRef = this.dialog.open(ProductCategoryFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        productCategory: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ProductCategoryFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((productCategory: ProductCategory) =>
          this.productCategoryService.editProductCategory({ ...productCategory, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la categoría producto. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getProductCategorys(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La categoría producto fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteProductCategory(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la categoría producto: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.productCategoryService.deleteProductCategory(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la categoría producto. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getProductCategorys(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La categoría producto fue eliminado correctamente.', 'Felicidades');
                modalRef.close();
              }
            }),
          ),
        ),
      )
      .subscribe();

    const sub1 = modalComponentRef.cancel.pipe(tap(() => modalRef.close())).subscribe();
    this.subscriptions.push(sub, sub1);
  }

  changeSort(sort: Sort) {
    this.getProductCategorys(this.filters, sort.active, sort.direction);
  }
}
