import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FilterTable } from '../../../../shared/models/table-filter.model';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse, DEFAULT_PAGE_SIZE, DEFAULT_PAGINATION_SIZE } from '../../../../core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import { TraceAccess } from '../../models/trace-access.model';
import { TracerAccessService } from '../../services/trace-access.service';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-trace-access-page',
  templateUrl: './trace-access-page.component.html',
  styleUrls: ['./trace-access-page.component.scss'],
})
export class TraceAccessPageComponent implements OnInit {
  traceAccess: TraceAccess[];
  dataCount = 0;
  subscriptions: Subscription[] = [];
  paginationSize = DEFAULT_PAGINATION_SIZE;
  displayedColumns = ['fecha', 'ip', 'usuario', 'evento'];
  columnsName = ['Fecha', 'IP', 'Usuario', 'Evento'];
  filters = {};
  tableFilters: FilterTable[] = [
    {
      name: 'fecha',
      type: 'date',
      title: 'Fecha',
    },
    {
      name: 'ip',
      type: 'text',
      title: 'IP',
    },
    {
      name: 'usuario',
      type: 'text',
      title: 'Usuario',
    },
    {
      name: 'evento',
      type: 'text',
      title: 'Evento',
    },
  ];

  constructor(private traceAccessService: TracerAccessService, private toastService: ToastrService) {}

  ngOnInit(): void {
    this.getTraceAccess();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getTraceAccess(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    const sub = this.traceAccessService
      .getTracesAccess(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<TraceAccess>) => {
          this.traceAccess = response.results;
          this.dataCount = response.count;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los datos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return null;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  onChangePage(page: PageEvent) {
    this.getTraceAccess(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.getTraceAccess(filters, 'id', 'desc');
  }

  onChangeSort(sort: Sort) {
    this.getTraceAccess(this.filters, sort.active, sort.direction);
  }
}
