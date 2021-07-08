import { ClinicHistoryService } from './../../services/clinic-history.service';
import { ToastrService } from 'ngx-toastr';
import { MetaTableNameService } from './../../services/metaTableName.service';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MetaTableName } from '../../models/MetaTable/MetaTable.model';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ClinicHistory } from '../../models/CLinicHistory/clinicHistory.model';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-clinic-history-page',
  templateUrl: './clinic-history-page.component.html',
  styleUrls: ['./clinic-history-page.component.scss'],
})
export class ClinicHistoryPageComponent implements OnInit {
  metaTableNames: MetaTableName[];
  clinicHistories: ClinicHistory[];
  dataCount = 0;
  configuration = {};
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;
  tableId: number;

  rowActionButtons = [
    {
      tooltipText: 'Editar Historia Clínica',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.goToForm(item),
    },
    {
      tooltipText: 'Eliminar Historia Clínica',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteClinicalHistory(item),
    },
  ];

  constructor(
    private metaTableService: MetaTableNameService,
    private toastService: ToastrService,
    public dialog: MatDialog,
    private router: Router,
    private clinicHistoryService: ClinicHistoryService,
  ) {}

  ngOnInit(): void {
    this.getMetaTableNames();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getClinicalHistories(tableId, filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.clinicHistoryService
      .getClinicHistories({ ...filters, mtn__id: tableId }, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<ClinicHistory>) => {
          this.clinicHistories = response.results;
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

  getMetaTableNames(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = 10000) {
    this.loading = true;
    const sub = this.metaTableService
      .getMetaTableNames(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<MetaTableName>) => {
          this.metaTableNames = response.results;
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

  goToForm(clicnicHistory?: ClinicHistory) {
    this.router.navigateByUrl(`/clinical-services/clinic-history/edit/${clicnicHistory.id}`);
  }

  onChangeSort(sort: Sort) {
    // this.getMetaTableNames(this.filters, sort.active, sort.direction);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    // this.getMetaTableNames(filters, 'id', 'desc');
  }

  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    // this.getMetaTableNames(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  deleteClinicalHistory(item: ClinicHistory) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la historia clínica: ${item.data_value}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.clinicHistoryService.deleteClicnicHistory(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la historia clínica. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getMetaTableNames(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La historia clínica fue eliminada correctamente.', 'Felicidades');
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

  onChangeTable(tableId) {
    this.tableId = tableId;
    this.getClinicalHistories(tableId);
  }
}
