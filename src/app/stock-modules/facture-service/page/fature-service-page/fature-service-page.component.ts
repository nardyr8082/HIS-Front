import { ServicesstockService } from './../../../servicesstock/services/servicesstock.service';
import { Servicesstock } from './../../../servicesstock/models/servicesstock.model';
import { DeleteConfirmationModalComponent } from './../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { FactureServiceFormComponent } from './../../components/fature-service-form/fature-service-form.component';
import { ApiResponse } from './../../../../core/models/api-response.model';
import { ToastrService } from 'ngx-toastr';
import { FactureService } from './../../../facture/services/facture.service';
import { FactureServiceService } from './../../services/facture-service.service';
import { FACTURE_SERVICE_TABLE_CONFIGURATION } from './../../models/facture-service-table-configuration';
import { FactureServiceModel } from './../../models/facture-service.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-fature-service-page',
  templateUrl: './fature-service-page.component.html',
  styleUrls: ['./fature-service-page.component.scss'],
})
export class FactureServicePageComponent implements OnInit, OnDestroy {
  factureServices: FactureServiceModel[];
  dataCount = 0;
  configuration = FACTURE_SERVICE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Factura de servicio',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Factura de servicio',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteFactureService(item),
    },
  ];

  constructor(
    private factureServiceService: FactureServiceService,
    private factureService: FactureService,
    private stockService: ServicesstockService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.associteStockServiceWithFilters();
    this.getEstado();
  }

  ngOnInit(): void {
    this.getFactureService();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  associteStockServiceWithFilters() {
    const sub = this.stockService
      .getServicesstock({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          const items = response.results.map((item) => ({ id: item.id, name: item.nombre }));
          this.configuration.tableFilters[5].items = items;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getEstado(filters = {}) {
    const sub = this.factureService
      .getEstado()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[4].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getFactureService(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.factureServiceService
      .getFactureService(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.factureServices = response.results.map((res) => ({
            ...res,
            operacion_comercial_id:res.operacion_comercial.id,
            estado_id: res.estado.id,
            estado_descrip: res.estado.descripcion,
            comercial_id:res.comercial.id,
            servicio_id: res.servicio.id,
            servicio_string: res.servicio.nombre,
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
    this.getFactureService(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getFactureService(filters, 'id', 'desc');
  }

  createFactureService() {
    let dialogRef: MatDialogRef<FactureServiceFormComponent, any>;

    dialogRef = this.dialog.open(FactureServiceFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        factureService: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as FactureServiceFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((factureService: FactureServiceModel) =>
          this.factureServiceService.createFactureService(factureService).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la Factura de servicio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getFactureService(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Factura de servicio fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<FactureServiceFormComponent, any>;

    dialogRef = this.dialog.open(FactureServiceFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        factureService: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as FactureServiceFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((factureServices: FactureServiceModel) =>
          this.factureServiceService.editFactureService({ ...factureServices, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la Factura de servicio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getFactureService(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Factura de servicio fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteFactureService(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la Factura de servicio seleccionanda?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.factureServiceService.deleteFactureService(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la Factura de servicio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getFactureService(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Factura de servicio fue eliminada correctamente.', 'Felicidades');
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
    this.getFactureService(this.filters, sort.active, sort.direction);
  }
}
