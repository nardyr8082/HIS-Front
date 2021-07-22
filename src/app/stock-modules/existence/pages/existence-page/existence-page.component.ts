import { ExistenceService } from '../../services/existence.service';
import { ProductCategoryService } from 'src/app/stock-modules/classifiers/product-category/services/product-category.service';
import { EXISTENCE_TABLE_CONFIGURATION } from '../../models/existence-table-configuration';
import { Existence } from '../../models/existence.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { ExistenceFormComponent } from '../../components/existence-form/existence-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { ProductCategory } from 'src/app/stock-modules/classifiers/product-category/models/product-category.model';


@Component({
  selector: 'app-existence-page',
  templateUrl: './existence-page.component.html',
  styleUrls: ['./existence-page.component.scss']
})
export class ExistencePageComponent implements OnInit {

  existence: Existence[];
  dataCount = 0;
  configuration = EXISTENCE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  productCategory = []

  rowActionButtons = [
    {
      tooltipText: 'Editar Existencia',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Existencia',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteExistence(item),
    },
  ];


  constructor(
    private existenceService: ExistenceService,
    private toastService: ToastrService,
    public dialog: MatDialog,
    private productCategoryService: ProductCategoryService
  ) {
    this.putProductCategory();
  }

  ngOnInit(): void {
    this.getExistence();
    this.getProductCategory();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }



  putProductCategory(filters = {}) {
    const sub = this.productCategoryService
      .getProductCategorys(filters, 'descripcion', 'asc', 1, 10000)

      .pipe(
        map((response) => {
          this.configuration.tableFilters[1].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getProductCategory() {
    const sub = this.productCategoryService
      .getProductCategorys({}, 'id', 'asc', 1, 1000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[1].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));

        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getExistence(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.existenceService
      .getExistence(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.existence = response.results.map((res) => ({
            ...res,
            existence_id: res.existence.id,
            existence_cantidad: res.existence.cantidad,
            existence_importe: res.existence.importe,
            existence_almacen: res.almacen.descripcion,
            existence_unidad_medida: res.unidad_medida.descripcion,
            existence_categoria: res.categoria.descripcion,

          }));

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
    this.getExistence(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getExistence(filters, 'id', 'desc');
  }


  createExistence() {
    let dialogRef: MatDialogRef<ExistenceFormComponent, any>;

    dialogRef = this.dialog.open(ExistenceFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {

        productCategory: null,

        existence: null,

      },
    });

    const modalComponentRef = dialogRef.componentInstance as ExistenceFormComponent;

    const sub = modalComponentRef.create
      .pipe(


        switchMap((Existence: Existence) =>
          this.existenceService.createExistence(Existence).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear Existencia . Por favor, inténtelo de nuevo más tarde.', 'Error');

              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getExistence(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('Existencia  fue creado correctamente.', 'Felicidades');

              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {

    let dialogRef: MatDialogRef<ExistenceFormComponent, any>;

    dialogRef = this.dialog.open(ExistenceFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        indicator: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ExistenceFormComponent;

    const sub = modalComponentRef.edit
      .pipe(

        switchMap((Existence: Existence) =>
          this.existenceService.editExistence({ ...Existence, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la existencia . Por favor, inténtelo de nuevo más tarde.', 'Error');

              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getExistence(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('La Existencia  fue modificado correctamente.', 'Felicidades');

              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteExistence(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;

    modalComponentRef.text = `¿Está seguro que desea eliminar la existencia?`;


    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.existenceService.deleteExistence(item.id).pipe(
            map(() => item),
            catchError(() => {

              this.toastService.error('Hubo un error al eliminar la existencia . Por favor, inténtelo de nuevo más tarde.', 'Error');

              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getExistence(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('La existencia  fue eliminado correctamente.', 'Felicidades');

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

    this.getExistence(this.filters, sort.active, sort.direction);
  }

}