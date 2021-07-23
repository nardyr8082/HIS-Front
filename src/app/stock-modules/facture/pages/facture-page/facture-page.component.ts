import { FactureService } from './../../services/facture.service';
import { FACTURE_TABLE_CONFIGURATION } from './../../models/facture-table-configuration';
import { Facture } from './../../models/facture.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { FactureFormComponent } from '../../components/facture-form/facture-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-facture-page',
  templateUrl: './facture-page.component.html',
  styleUrls: ['./facture-page.component.scss'],
})
export class FacturePageComponent implements OnInit, OnDestroy {
  facture: Facture[];
  dataCount = 0;
  configuration = FACTURE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Factura',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Factura',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteFacture(item),
    },
  ];

  constructor(private factureService: FactureService, private toastService: ToastrService, public dialog: MatDialog) {
    this.getEstado();
  }

  ngOnInit(): void {
    this.getFacture();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
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

  getFacture(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.factureService
      .getFacture(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.facture = response.results.map((res) => ({
            ...res,
            operacion_comercial_id: res.operacion_comercial.id,
            estado_id: res.estado.id,
            estado_descrip: res.estado.descripcion,
            comercial_id: res.comercial.id,
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
    this.getFacture(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getFacture(filters, 'id', 'desc');
  }

  createFacture() {
    let dialogRef: MatDialogRef<FactureFormComponent, any>;

    dialogRef = this.dialog.open(FactureFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        facture: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as FactureFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((facture: Facture) =>
          this.factureService.createFacture(facture).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la Factura. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getFacture(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Factura fue creada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<FactureFormComponent, any>;

    dialogRef = this.dialog.open(FactureFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '1000px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        facture: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as FactureFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((facture: Facture) =>
          this.factureService.editFacture({ ...facture, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la factura. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getFacture(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Factura fue modificada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteFacture(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la Factura?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.factureService.deleteFacture(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la Factura. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getFacture(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Factura fue eliminada correctamente.', 'Felicidades');
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
    this.getFacture(this.filters, sort.active, sort.direction);
  }
}
