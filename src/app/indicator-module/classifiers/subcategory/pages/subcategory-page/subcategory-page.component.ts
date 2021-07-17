import { CategoryService } from './../../../category/services/category.service';
import { SubcategoryService } from './../../services/subcategory.service';
import { SUBCATEGORY_TABLE_CONFIGURATION } from './../../models/subcategory-table-configuration';
import { Subcategory } from './../../models/subcategory.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { SubcategoryFormComponent } from '../../components/subcategory-form/subcategory-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-subcategory-page',
  templateUrl: './subcategory-page.component.html',
  styleUrls: ['./subcategory-page.component.scss'],
})
export class SubcategoryPageComponent implements OnInit, OnDestroy {
  subcategory: Subcategory[];
  dataCount = 0;
  configuration = SUBCATEGORY_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Subcategoría',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Subcategoría',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteSubcategory(item),
    },
  ];

  constructor(
    private subcategoryService: SubcategoryService,
    private toastService: ToastrService,
    public dialog: MatDialog,
    private categoryService: CategoryService,
  ) {
    this.putCategorys();
  }

  ngOnInit(): void {
    this.getSubcategory();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  putCategorys(filters = {}) {
    const sub = this.categoryService
      .getCategorys(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[1].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getSubcategory(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.subcategoryService
      .getSubcategory(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.subcategory = response.results.map((resp) => {
            const categoria = resp.categoria ? resp.categoria.descripcion : '';
            const categoria_id = resp.categoria ? resp.categoria.id : '';
            return { ...resp, categoria: categoria, categoria_id: categoria_id };
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
    this.getSubcategory(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getSubcategory(filters, 'id', 'desc');
  }

  createSubcategory() {
    let dialogRef: MatDialogRef<SubcategoryFormComponent, any>;

    dialogRef = this.dialog.open(SubcategoryFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        subcategory: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as SubcategoryFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((subcategory: Subcategory) =>
          this.subcategoryService.createSubcategory(subcategory).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la subcategoría. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSubcategory(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La subcategoría fue creada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<SubcategoryFormComponent, any>;

    dialogRef = this.dialog.open(SubcategoryFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        subcategory: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as SubcategoryFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((subcategory: Subcategory) =>
          this.subcategoryService.editSubcategory({ ...subcategory, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la subcategoría. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSubcategory(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La subcategoría fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteSubcategory(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la Subcategoría: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.subcategoryService.deleteSubcategory(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la subcategoría. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSubcategory(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La subcategoría fue eliminado correctamente.', 'Felicidades');
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
    this.getSubcategory(this.filters, sort.active, sort.direction);
  }
}
