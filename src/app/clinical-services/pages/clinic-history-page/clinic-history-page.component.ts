import { MetaTableField } from './../../models/MetaTableField/MetaTableField.model';
import { MetaTableFieldService } from './../../services/metaTableField.service';
import { DEFAULT_PAGINATION_SIZE } from './../../../core/models/api-response.model';
import { TableConfiguration } from 'src/app/shared/models/table-configuration.model';
import { ClinicHistoryService } from './../../services/clinic-history.service';
import { ToastrService } from 'ngx-toastr';
import { MetaTableNameService } from './../../services/metaTableName.service';
import { Component, OnInit } from '@angular/core';
import { of, Subscription, Observable, combineLatest } from 'rxjs';
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
  dataTable;
  dataCount = 0;

  selectedTableName;

  metaTableFields: MetaTableField[];
  configuration: TableConfiguration;
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
    private metaTableFieldService: MetaTableFieldService,
  ) {}

  ngOnInit(): void {
    this.getMetaTableNames();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getClinicalHistories(tableId, filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    return this.clinicHistoryService.getClinicHistories({ ...filters, mtn__id: tableId }, sortColumn, sortDirection, page, pageSize).pipe(
      map((response: ApiResponse<ClinicHistory>) => {
        this.clinicHistories = response.results;
      }),
      catchError(() => {
        this.toastService.error('Hubo un error al obtener los datos. Por favor, inténtelo de nuevo más tarde.', 'Error');
        return null;
      }),
    );
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
    this.router.navigate([`/clinical-services/clinic-history/edit/${this.selectedTableName}`], { queryParams: { ...clicnicHistory } });
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
    modalComponentRef.text = `¿Está seguro que desea eliminar la historia clínica seleccionada?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        map(() => {
          const observables: Observable<any>[] = [];
          this.metaTableFields.forEach((mtf) => {
            const observable: Observable<any> = this.clinicHistoryService.deleteClicnicHistory(item[`id_${mtf.mtf_fieldname}`]).pipe(
              map(() => item),
              catchError(() => {
                this.toastService.error('Hubo un error al eliminar la historia clínica. Por favor, inténtelo de nuevo más tarde.', 'Error');
                modalRef.close();
                return of(null);
              }),
            );

            observables.push(observable);

            combineLatest(observables)
              .pipe(
                map((success) => {
                  if (success && success.length == this.metaTableFields.length) {
                    this.toastService.success('La historia clínica fue eliminada correctamente.', 'Felicidades');
                    modalRef.close();
                    this.onChangeTable(this.tableId);
                  }
                }),
              )
              .subscribe();
          });
        }),
      )
      .subscribe();

    const sub1 = modalComponentRef.cancel.pipe(tap(() => modalRef.close())).subscribe();
    this.subscriptions.push(sub, sub1);
  }

  onChangeTable(tableId) {
    this.tableId = tableId;
    this.dataTable = null;

    this.selectedTableName = tableId;
    const observableMetafield = this.getMetaTableFields(tableId);
    const observableClinicalHistory = this.getClinicalHistories(tableId);

    const observables: Observable<any>[] = [observableMetafield, observableClinicalHistory];

    const sub = combineLatest(observables)
      .pipe(
        map(() => {
          this.getDataTable(this.clinicHistories, this.metaTableFields);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getMetaTableFields(tableId) {
    return this.metaTableFieldService.getMetaTableFields({ mtn__id: tableId }, 'id', 'asc', 1, 10000).pipe(
      map((response) => {
        this.metaTableFields = response.results;
        this.getConfiguration(this.metaTableFields);
      }),
    );
  }

  getConfiguration(metaTableFields: MetaTableField[]) {
    this.configuration = {
      paginationSize: DEFAULT_PAGINATION_SIZE,
      displayedColumns: metaTableFields.map((mtf) => mtf.mtf_fieldname),
      columnsName: metaTableFields.map((mtf) => mtf.mtf_fieldname),
      tableFilters: metaTableFields.map((mtf) => ({
        name: mtf.mtf_fieldname,
        type: 'text',
        title: mtf.mtf_fieldname,
      })),
    };
  }

  getDataTable(clinicHistories: ClinicHistory[], metaTableFields: MetaTableField[]) {
    const groupBy = (key) => (array) =>
      array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
      }, {});

    const dataRecords = groupBy('table_record_id')(clinicHistories);
    this.dataCount = dataRecords.length;
    const data = [];
    Object.keys(dataRecords).forEach((key) => {
      const sortedDataRecord: Array<any> = dataRecords[key].sort((a, b) => {
        if (a.mtf > b.mtf) return 1;
        if (a.mtf < b.mtf) return -1;
        return 0;
      });
      dataRecords[key] = sortedDataRecord;
    });

    const values: Array<Array<ClinicHistory>> = Object.values(dataRecords);
    values.forEach((item, index) => {
      data.push({});
      item.forEach((hc, i) => {
        data[index][`id_${metaTableFields[i].mtf_fieldname}`] = hc.id;
        data[index] = { ...data[index], [metaTableFields[i].mtf_fieldname]: hc.data_value };
      });
    });

    this.dataTable = data;
    this.dataCount = this.dataTable.length;
  }
}
