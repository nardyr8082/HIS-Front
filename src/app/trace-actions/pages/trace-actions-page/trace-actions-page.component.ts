import { ToastrService } from 'ngx-toastr';
import { TracerActionsService } from './../../services/trace-actions.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TraceAction } from '../../models/trace-action.model';
import { ApiResponse } from 'src/app/core/models/api-response.model';

@Component({
  selector: 'app-trace-actions-page',
  templateUrl: './trace-actions-page.component.html',
  styleUrls: ['./trace-actions-page.component.scss'],
})
export class TraceActionsPageComponent implements OnInit, OnDestroy {
  traceActions: TraceAction[];
  subscriptions: Subscription[] = [];
  displayedColumns = ['fecha', 'ip', 'usuario', 'objeto', 'evento'];
  columnsName = ['Fecha', 'IP', 'Usuario', 'Objeto', 'Evento'];

  constructor(private traceActionService: TracerActionsService, private toastService: ToastrService) {}

  ngOnInit(): void {
    this.getTraceActions();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getTraceActions(filters = {}, sortColumn = 'updatedAt', sortDirection = 'desc', page = 1, pageSize = 1) {
    const sub = this.traceActionService
      .getTracesActions(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<TraceAction>) => {
          console.log(response.results);
          this.traceActions = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los datos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return null;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
}
