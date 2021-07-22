import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { Pricechanges_TABLE_CONFIGURATION } from '../../models/pricechanges-table-configuration';
import { Pricechanges } from '../../models/pricechanges.model';
import { PricechangesService } from '../../services/pricechanges.service';
import { PricechangesFormComponent } from '../../components/pricechanges-form/pricechanges-form.component';

@Component({
  selector: 'app-pricechanges-page',
  templateUrl: './pricechanges-page.component.html',
  styleUrls: ['./pricechanges-page.component.scss'],
})
export class PricechangesPageComponent implements OnInit, OnDestroy {
  pricechanges: Pricechanges[];
  dataCount = 0;
  configuration = Pricechanges_TABLE_CONFIGURATION;
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
      callback: (item) => this.deletePricechanges(item),
    },
  ];

  constructor(
    private pricechangesService: PricechangesService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.getLote();
    this.getUser();
  }

  ngOnInit(): void {
    this.getPricechanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  getUser(filters = {}) {
    const sub = this.pricechangesService
      .getUser()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[5].items = response.results.map((res) => ({ id: res.id, name: res.username }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getLote(filters = {}) {
    const sub = this.pricechangesService
      .getLote()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[4].items = response.results.map((res) => ({ id: res.id, name: res.codigo }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }


  getPricechanges(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.pricechangesService
      .getPricechanges(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.pricechanges = response.results.map((res) => ({
            ...res,
            lote_codigo: res.lote.codigo,
            lote_id: res.lote.id,
            usuario_username: res.usuario.username,
            usuario_id: res.usuario.id,
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
    this.getPricechanges(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getPricechanges(filters, 'id', 'desc');
  }

  createPricechanges() {
    let dialogRef: MatDialogRef<PricechangesFormComponent, any>;

    dialogRef = this.dialog.open(PricechangesFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        pricechanges: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as PricechangesFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((pricechanges: Pricechanges) =>
          this.pricechangesService.createPricechanges(pricechanges).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Cambio Precio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPricechanges(this.filters, 'id', 'desc', this.page, this.pageSize);
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
    let dialogRef: MatDialogRef<PricechangesFormComponent, any>;

    dialogRef = this.dialog.open(PricechangesFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        pricechanges: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as PricechangesFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((pricechanges: Pricechanges) =>
          this.pricechangesService.editPricechanges({ ...pricechanges, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Cambio Precio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPricechanges(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Cambio Precio fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deletePricechanges(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Cambio Precio?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.pricechangesService.deletePricechanges(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Cambio Precio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPricechanges(this.filters, 'id', 'desc', this.page, this.pageSize);
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
    this.getPricechanges(this.filters, sort.active, sort.direction);
  }
}
