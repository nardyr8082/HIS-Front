import { MoveStatusFormComponent } from '../../components/move-status-form.component/move-status-form.component';

import { ToastrService } from 'ngx-toastr';
import { MoveStatusService } from '../../services/move-status.service';
import { MOVE_STATUS_TABLE_CONFIGURATION } from '../../models/move-status-table-configuration';
import { MoveStatus } from '../../models/move-status.model';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-move-status-page',
  templateUrl: './move-status-page.component.html',
  styleUrls: ['./move-status-page.component.scss'],
})
export class MoveStatusPageComponent implements OnInit {
  movesStatus: MoveStatus[];
  dataCount = 0;
  configuration = MOVE_STATUS_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Estado de Movimiento',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Estado de Movimiento',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteProgram(item),
    },
  ];

  constructor(private moveStatusService: MoveStatusService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getMovesStatus();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getMovesStatus(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.moveStatusService
      .getMoveStatus(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<MoveStatus>) => {
          this.movesStatus = response.results;
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
    this.getMovesStatus(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getMovesStatus(filters, 'id', 'desc');
  }

  createMoveStatus() {
    let dialogRef: MatDialogRef<MoveStatusFormComponent, any>;

    dialogRef = this.dialog.open(MoveStatusFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        moveStatus: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as MoveStatusFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((moveStatus: MoveStatus) =>
          this.moveStatusService.createMoveStatus(moveStatus).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el estado de movimiento. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getMovesStatus(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado de movimiento fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<MoveStatusFormComponent, any>;

    dialogRef = this.dialog.open(MoveStatusFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        moveStatus: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as MoveStatusFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((moveStatus: MoveStatus) =>
          this.moveStatusService.editMoveStatus({ ...moveStatus, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el estado de movimiento. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getMovesStatus(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado de movimiento fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteProgram(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el estado de movimiento: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.moveStatusService.deleteMoveStatus(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el estado de movimiento. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getMovesStatus(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado de movimiento fue eliminado correctamente.', 'Felicidades');
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
    this.getMovesStatus(this.filters, sort.active, sort.direction);
  }
}
