import { MetaTableNameService } from './../../services/metaTableName.service';
import { META_TABLE_NAME_CONFIGURATION } from './../../models/MetaTable/meta-table-configuration';
import { MetaTableName } from './../../models/MetaTable/MetaTable.model';
import { Component, OnInit } from '@angular/core';
import { map, catchError, filter, switchMap, tap } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-dynamic-table-page',
  templateUrl: './dynamic-table-page.component.html',
  styleUrls: ['./dynamic-table-page.component.scss'],
})
export class DynamicTablePageComponent implements OnInit {
  metaTableNames: MetaTableName[];
  dataCount = 0;
  configuration = META_TABLE_NAME_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Tabla',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.goToForm(item),
    },
    {
      tooltipText: 'Eliminar Tabla',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteMetaTableName(item),
    },
  ];

  constructor(private metaTableService: MetaTableNameService, private toastService: ToastrService, public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.getMetaTableNames();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getMetaTableNames(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.metaTableService
      .getMetaTableNames(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<MetaTableName>) => {
          this.metaTableNames = response.results;
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

  goToForm(metaTableName?: MetaTableName) {
    metaTableName
      ? this.router.navigateByUrl(`/clinical-services/meta-table/edit/${metaTableName.id}`)
      : this.router.navigateByUrl(`/clinical-services/meta-table/create`);
  }

  onChangeSort(sort: Sort) {
    this.getMetaTableNames(this.filters, sort.active, sort.direction);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getMetaTableNames(filters, 'id', 'desc');
  }

  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getMetaTableNames(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  deleteMetaTableName(item: MetaTableName) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la tabla: ${item.mtn_tablename}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.metaTableService.deleteMetaTableName(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la tabla. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getMetaTableNames(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La tabla fue eliminado correctamente.', 'Felicidades');
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
}
