import { Component, OnInit, OnDestroy } from '@angular/core';
import { CivilStatusService } from '../../services/civil-status.service';
import { CIVIL_STATUS_TABLE_CONFIGURATION } from 'src/app/nomenclator-modules/civil-status/models/civil-status-table-configuration';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { CivilStatusFormComponent } from '../../components/civil-status-form/civil-status-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { CivilStatus } from '../../models/civil-status.model';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';

@Component({
  selector: 'app-civil-status-page',
  templateUrl: './civil-status-page.component.html',
  styleUrls: ['./civil-status-page.component.scss']
})
export class CivilStatusPageComponent implements OnInit, OnDestroy {

  civilStatus: CivilStatus[];
  dataCount = 0;
  configuration = CIVIL_STATUS_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Estado Civil',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Estado Civil',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteCivilStatus(item),
    },
  ];

  constructor(private civilStatusService: CivilStatusService, private toastService: ToastrService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCivilStatus();
  }

   ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getCivilStatus(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.civilStatusService
      .getCivilStatus(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<CivilStatus>) => {
          this.civilStatus = response.results;
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
    this.getCivilStatus(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getCivilStatus(filters, 'id', 'desc');
  }

  createCivilStatus() {
    let dialogRef: MatDialogRef<CivilStatusFormComponent, any>;

    dialogRef = this.dialog.open(CivilStatusFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        civilStatus: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as CivilStatusFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((civilStatus: CivilStatus) =>
          this.civilStatusService.createCivilStatus(civilStatus).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el estado civil. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCivilStatus(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado civil fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<CivilStatusFormComponent, any>;

    dialogRef = this.dialog.open(CivilStatusFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        civilStatus: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as CivilStatusFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((civilStatus: CivilStatus) =>
          this.civilStatusService.editCivilStatus({ ...civilStatus, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el estado civil. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCivilStatus(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado civil fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  deleteCivilStatus(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el estado civil: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.civilStatusService.deleteCivilStatus(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el estado civil. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCivilStatus(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El estado civil fue eliminado correctamente.', 'Felicidades');
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
    this.getCivilStatus(this.filters, sort.active, sort.direction);
  }

}
