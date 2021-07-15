import { ProductFamilyService } from './../../services/product-family.service';
import { PRODUCT_FAMILY_TABLE_CONFIGURATION } from './../../models/product-family-table-configuration';
import { ProductFamily } from './../../models/product-family.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { ProductFamilyFormComponent } from '../../components/product-family-form/product-family-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-product-family-page',
  templateUrl: './product-family-page.component.html',
  styleUrls: ['./product-family-page.component.scss'],
})
export class ProductFamilyPageComponent implements OnInit, OnDestroy {
  productFamily: ProductFamily[];
  dataCount = 0;
  configuration = PRODUCT_FAMILY_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Familia Producto',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Familia Producto',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteProductFamily(item),
    },
  ];

  constructor(private productFamilyService: ProductFamilyService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getProductFamily();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getProductFamily(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.productFamilyService
      .getProductFamily(null, filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.productFamily = response.results.map((response) => {
            const padre = response.padre ? response.padre.codigo : '';
            const padre_id = response.padre ? response.padre.id : '';
            return { ...response, padre: padre, padre_id: padre_id };
          });
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
    this.getProductFamily(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getProductFamily(filters, 'id', 'desc');
  }

  createProductFamily() {
    let dialogRef: MatDialogRef<ProductFamilyFormComponent, any>;

    dialogRef = this.dialog.open(ProductFamilyFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        productFamily: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ProductFamilyFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((productFamily: ProductFamily) =>
          this.productFamilyService.createProductFamily(productFamily).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la Familia Producto. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getProductFamily(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Familia Producto fue creada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<ProductFamilyFormComponent, any>;

    dialogRef = this.dialog.open(ProductFamilyFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        productFamily: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as ProductFamilyFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((productFamily: ProductFamily) =>
          this.productFamilyService.editProductFamily({ ...productFamily, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la Familia Producto. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getProductFamily(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Familia Producto fue modificada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteProductFamily(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la Familia de Producto: ${item.codigo}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.productFamilyService.deleteProductFamily(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la Familia de Producto. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getProductFamily(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Familia de Producto fue eliminada correctamente.', 'Felicidades');
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

  onChangeSort(sort: Sort) {
    this.getProductFamily(this.filters, sort.active, sort.direction);
  }
}
