import { MoveTypeFormComponent } from './../../components/move-type-form/move-type-form.component';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { MOVE_TYPE_TABLE_CONFIGURATION } from './../../models/move-type-table-configuration';
import { MoveTypeService } from '../../services/moveType.service';
import { Component, OnInit } from '@angular/core';
import { MoveType } from '../../models/move-type.model';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { ProductCategoryService } from '../../../product-category/services/product-category.service';

@Component({
  selector: 'app-move-type-page',
  templateUrl: './move-type-page.component.html',
  styleUrls: ['./move-type-page.component.scss'],
})
export class MoveTypePageComponent implements OnInit {
  moveTypes: MoveType[];
  dataCount = 0;
  configuration = MOVE_TYPE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Tipo de movimiento',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Tipo de movimiento',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteMoveType(item),
    },
  ];

  constructor(private moveTypeService: MoveTypeService, private toastService: ToastrService, public dialog: MatDialog,
       private productCategoryService: ProductCategoryService,
  ) {
    this.getProductCategorys();
  }

  ngOnInit(): void {
    this.getMoveTypes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getProductCategorys(filters = {}) {
    this.loading = true;
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

  getMoveTypes(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.moveTypeService
      .getMoveTypes(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.moveTypes = response.results.map((resp) => {
            const categoria = resp.categoria ? resp.categoria.descripcion : '';
            const categoria_id = resp.categoria ? resp.categoria.id : '';
            return { ...resp, categoria: categoria, categoria_id: categoria_id };
          });
          this.dataCount = response.count;
          this.loading = false;
          console.log(this.moveTypes);
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
    this.getMoveTypes(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getMoveTypes(filters, 'id', 'desc');
  }

  createMoveType() {
    let dialogRef: MatDialogRef<MoveTypeFormComponent, any>;

    dialogRef = this.dialog.open(MoveTypeFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        moveType: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as MoveTypeFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((MoveType: MoveType) =>
          this.moveTypeService.createMoveType(MoveType).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la Tipo de movimiento. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getMoveTypes(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Tipo de movimiento fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<MoveTypeFormComponent, any>;

    dialogRef = this.dialog.open(MoveTypeFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        moveType: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as MoveTypeFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((MoveType: MoveType) =>
          this.moveTypeService.editMoveType({ ...MoveType, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la Tipo de movimiento. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getMoveTypes(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Tipo de movimiento fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteMoveType(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la Tipo de movimiento: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.moveTypeService.deleteMoveType(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la Tipo de movimiento. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getMoveTypes(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Tipo de movimiento fue eliminado correctamente.', 'Felicidades');
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
    this.getMoveTypes(this.filters, sort.active, sort.direction);
  }
}
