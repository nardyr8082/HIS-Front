import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Aftselfresources, Patient } from '../../models/aftselfresources.model';
import { Aftselfresources_TABLE_CONFIGURATION } from '../../models/aftselfresources-table-configuration';
import { AftselfresourcesService } from '../../services/aftselfresources.service';
import { AftselfresourcesFormComponent } from '../../components/aftselfresources-form/aftselfresources-form.component';

@Component({
  selector: 'app-aftselfresources-page',
  templateUrl: './aftselfresources-page.component.html',
  styleUrls: ['./aftselfresources-page.component.scss'],
})
export class AftselfresourcesPageComponent implements OnInit {
  aftselfresources: Aftselfresources[];
  dataCount = 0;
  configuration = Aftselfresources_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Recurso Propio',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Recurso Propio',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteAftselfresources(item),
    },
  ];

  constructor(
    private aftselfresourcesService: AftselfresourcesService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.getOffice();
    this.getPatient();
    this.getClassificator();
    this.getStatus();
  }

  ngOnInit(): void {
    this.getAftselfresources();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  getClassificator(filters = {}) {
    const sub = this.aftselfresourcesService
      .getClassificator()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[2].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getOffice(filters = {}) {
    const sub = this.aftselfresourcesService
      .getOffice()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[3].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getPatient(filters = {}) {
    const sub = this.aftselfresourcesService
      .getPatient()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[4].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getStatus(filters = {}) {
    const sub = this.aftselfresourcesService
      .getStatus()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[5].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }


  getAftselfresources(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.aftselfresourcesService
      .getAftselfresources(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.aftselfresources = response.results.map((res) => ({
            ...res,
            id_recurso_nombre: res.id_recurso.nombre,
            id_recurso_id: res.id_recurso.id,
            id_departamento_nombre: res.id_departamento.nombre,
            id_departamento_id: res.id_departamento.id,
            paciente_nombre: res.paciente.nombre,
            paciente_id: res.paciente.id,
            id_estado_descripcion: res.id_estado.descripcion,
            id_estado_id: res.id_estado.id,
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
    this.getAftselfresources(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getAftselfresources(filters, 'id', 'desc');
  }

  createAftselfresources() {
    let dialogRef: MatDialogRef<AftselfresourcesFormComponent, any>;

    dialogRef = this.dialog.open(AftselfresourcesFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        aftselfresources: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as AftselfresourcesFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((aftselfresources: Aftselfresources) =>
          this.aftselfresourcesService.createAftselfresources(aftselfresources).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el recurso propio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getAftselfresources(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El recurso propio fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<AftselfresourcesFormComponent, any>;

    dialogRef = this.dialog.open(AftselfresourcesFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        aftselfresources: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as AftselfresourcesFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((aftselfresources: Aftselfresources) =>
          this.aftselfresourcesService.editAftselfresources({ ...aftselfresources, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el recurso propio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getAftselfresources(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El recurso propio fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteAftselfresources(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Recurso Propio?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.aftselfresourcesService.deleteAftselfresources(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Recurso Propio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getAftselfresources(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Recurso Propio fue eliminado correctamente.', 'Felicidades');
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
    this.getAftselfresources(this.filters, sort.active, sort.direction);
  }
}
