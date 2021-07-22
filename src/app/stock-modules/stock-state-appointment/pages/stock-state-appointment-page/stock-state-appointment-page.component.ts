import { DeleteConfirmationModalComponent } from './../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { StockStateAppointmentFormComponent } from './../../components/stock-state-appointment-form/stock-state-appointment-form.component';
import { ApiResponse } from './../../../../core/models/api-response.model';
import { ToastrService } from 'ngx-toastr';
import { StateAppointmentService } from './../../services/stock-state-appointment.service';
import { StateAppointment } from './../../models/stock-state-appointment.model';
import { STATE_APPOINTMENT_TABLE_CONFIGURATION } from './../../models/stock-state-appointment-table-configuration';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-stock-state-appointment-page',
  templateUrl: './stock-state-appointment-page.component.html',
  styleUrls: ['./stock-state-appointment-page.component.scss'],
})
export class StockStateAppointmentPageComponent implements OnInit {
  stateAppointments: StateAppointment[];
  dataCount = 0;
  configuration = STATE_APPOINTMENT_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Estado de cita',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Estado de cita',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteStateAppointment(item),
    },
  ];

  constructor(private stateAppointmentService: StateAppointmentService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getStateAppointments();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getStateAppointments(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.stateAppointmentService
      .getStateAppointments(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<StateAppointment>) => {
          this.stateAppointments = response.results;
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
    this.getStateAppointments(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getStateAppointments(filters, 'id', 'desc');
  }

  createStateAppointment() {
    let dialogRef: MatDialogRef<StockStateAppointmentFormComponent, any>;

    dialogRef = this.dialog.open(StockStateAppointmentFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        stockStateAppointment: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as StockStateAppointmentFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((stockStateAppointment: StateAppointment) =>
          this.stateAppointmentService.createStateAppointment(stockStateAppointment).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Estado de cita. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getStateAppointments(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Estado de cita fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<StockStateAppointmentFormComponent, any>;

    dialogRef = this.dialog.open(StockStateAppointmentFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        stockStateAppointment: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as StockStateAppointmentFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((stockStateAppointment: StateAppointment) =>
          this.stateAppointmentService.editStateAppointment({ ...stockStateAppointment, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Estado de cita. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getStateAppointments(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Estado de cita fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteStateAppointment(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Estado de cita: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.stateAppointmentService.deleteStateAppointment(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Estado de cita. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getStateAppointments(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Estado de cita fue eliminado correctamente.', 'Felicidades');
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
    this.getStateAppointments(this.filters, sort.active, sort.direction);
  }
}
