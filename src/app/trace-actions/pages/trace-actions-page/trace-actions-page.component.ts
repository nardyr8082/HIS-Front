import { ToastrService } from 'ngx-toastr';
import { TracerActionsService } from './../../services/trace-actions.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TraceAction } from '../../models/trace-action.model';
import { ApiResponse, DEFAULT_PAGE_SIZE, DEFAULT_PAGINATION_SIZE } from 'src/app/core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-trace-actions-page',
  templateUrl: './trace-actions-page.component.html',
  styleUrls: ['./trace-actions-page.component.scss'],
})
export class TraceActionsPageComponent implements OnInit, OnDestroy {
  traceActions: TraceAction[];
  dataCount = 0;
  subscriptions: Subscription[] = [];
  paginationSize = DEFAULT_PAGINATION_SIZE;
  displayedColumns = ['fecha', 'ip', 'usuario', 'objeto', 'evento'];
  columnsName = ['Fecha', 'IP', 'Usuario', 'Objeto', 'Evento'];

  constructor(private traceActionService: TracerActionsService, private toastService: ToastrService) {}

  ngOnInit(): void {
    this.getTraceActions();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getTraceActions(filters = {}, sortColumn = 'updatedAt', sortDirection = 'desc', page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    const sub = this.traceActionService
      .getTracesActions(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<TraceAction>) => {
          console.log(response.results);
          this.traceActions = response.results;
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
    this.getTraceActions({}, 'updatedAt', 'desc', page.pageIndex + 1, page.pageSize);
  }
}
