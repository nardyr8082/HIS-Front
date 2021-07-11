import { CategoryService } from '../../services/category.service';
import { CATEGORY_TABLE_CONFIGURATION } from '../../models/category-table-configuration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { Category } from '../../models/category.model';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss'],
})
export class CategoryPageComponent implements OnInit, OnDestroy {
  categorys: Category[];
  dataCount = 0;
  configuration = CATEGORY_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Categoría',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Categoría',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteCategory(item),
    },
  ];

  constructor(private categoryService: CategoryService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getCategorys();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getCategorys(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.categoryService
      .getCategorys(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Category>) => {
          this.categorys = response.results;
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
    this.getCategorys(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getCategorys(filters, 'id', 'desc');
  }

  createCategory() {
    let dialogRef: MatDialogRef<CategoryFormComponent, any>;

    dialogRef = this.dialog.open(CategoryFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        category: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as CategoryFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((category: Category) =>
          this.categoryService.createCategory(category).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la categoría. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCategorys(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La categoría fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<CategoryFormComponent, any>;

    dialogRef = this.dialog.open(CategoryFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        category: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as CategoryFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((category: Category) =>
          this.categoryService.editCategory({ ...category, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la categoría. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCategorys(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La categoría fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteCategory(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Categoría: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.categoryService.deleteCategory(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la categoría. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCategorys(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La categoría fue eliminado correctamente.', 'Felicidades');
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
    this.getCategorys(this.filters, sort.active, sort.direction);
  }
}
