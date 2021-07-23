import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { Servicesstock } from '../../models/servicesstock.model';
import { Servicesstock_TABLE_CONFIGURATION } from '../../models/servicesstock-table-configuration';
import { ServicesstockFormComponent } from '../../components/servicesstock-form/servicesstock-form.component';
import { ServicesstockService } from '../../services/servicesstock.service';

@Component({
  selector: 'app-servicesstock-page',
  templateUrl: './servicesstock-page.component.html',
  styleUrls: ['./servicesstock-page.component.scss'],
})
export class ServicesstockPageComponent implements OnInit, OnDestroy {
  servicesstock: Servicesstock[];
  dataCount = 0;
  configuration = Servicesstock_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Cambio Precio',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Cambio Precio',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteServicesstock(item),
    },
  ];

  constructor(
    private servicesstockService: ServicesstockService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.getOffice();
    this.getImpuesto();
    this.getUser();
  }

  ngOnInit(): void {
    this.getServicesstock();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  getUser(filters = {}) {
    const sub = this.servicesstockService
      .getUser()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[5].items = response.results.map((res) => ({ id: res.id, name: res.username }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getOffice(filters = {}) {
    const sub = this.servicesstockService
      .getOffice()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[5].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getImpuesto(filters = {}) {
    const sub = this.servicesstockService
      .getImpuesto()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[3].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }


  getServicesstock(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.servicesstockService
      .getServicesstock(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.servicesstock = response.results.map((res) => ({
            ...res,
            impuesto_descripcion: res.impuesto.descripcion,
            impuesto_id: res.impuesto.id,
            usuario_username: res.usuario.username,
            usuario_id: res.usuario.id,
            departamento_nombre: res.departamento.nombre,
            departamento_id: res.departamento.id,
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
    this.getServicesstock(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getServicesstock(filters, 'id', 'desc');
  }

  createServicesstock() {
    let dialogRef: MatDialogRef<ServicesstockFormComponent, any>;

    dialogRef = this.dialog.open(ServicesstockFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        servicesstock: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ServicesstockFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((servicesstock: Servicesstock) =>
          this.servicesstockService.createServicesstock(servicesstock).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Cambio Precio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getServicesstock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Cambio Precio fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<ServicesstockFormComponent, any>;

    dialogRef = this.dialog.open(ServicesstockFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        servicesstock: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as ServicesstockFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((servicesstock: Servicesstock) =>
          this.servicesstockService.editServicesstock({ ...servicesstock, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Cambio Precio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getServicesstock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Cambio Precio fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteServicesstock(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Cambio Precio?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.servicesstockService.deleteServicesstock(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Cambio Precio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getServicesstock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Cambio Precio fue eliminado correctamente.', 'Felicidades');
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
    this.getServicesstock(this.filters, sort.active, sort.direction);
  }
}
