import { ToastrService } from 'ngx-toastr';
import { FrequencyService } from './../../services/frequency.service';
import { Frequency } from './../../models/frequency.model';
import { FREQUENCY_TABLE_CONFIGURATION } from './../../models/frequency-table-configuration';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { FrequencyFormComponent } from '../../components/frequency-form/frequency-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-frequency-type-page',
  templateUrl: './frequency-page.component.html',
  styleUrls: ['./frequency-page.component.scss'],
})
export class FrequencyPageComponent implements OnInit {
  frequency: Frequency[];
  dataCount = 0;
  configuration = FREQUENCY_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Frecuencua',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Frecuencia',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteFrequency(item),
    },
  ];

  constructor(private frequencyService: FrequencyService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getFrequency();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getFrequency(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.frequencyService
      .getFrequency(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Frequency>) => {
          this.frequency = response.results;
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
    this.getFrequency(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getFrequency(filters, 'id', 'desc');
  }

  createFrequency() {
    let dialogRef: MatDialogRef<FrequencyFormComponent, any>;

    dialogRef = this.dialog.open(FrequencyFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        frequency: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as FrequencyFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((frequency: Frequency) =>
          this.frequencyService.createFrequency(frequency).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la frecuencia. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getFrequency(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La frecuencia fue creada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<FrequencyFormComponent, any>;

    dialogRef = this.dialog.open(FrequencyFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        frequency: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as FrequencyFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((frequency: Frequency) =>
          this.frequencyService.editFrequency({ ...frequency, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la frecuencia. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getFrequency(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La frecuencia fue modificada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteFrequency(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la frecuencia: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.frequencyService.deleteFrequency(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la frecuencia. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getFrequency(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La frecuencia fue eliminada correctamente.', 'Felicidades');
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
    this.getFrequency(this.filters, sort.active, sort.direction);
  }
}
