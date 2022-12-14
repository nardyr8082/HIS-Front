import { ActionDetailsComponent } from './../../components/action-details/action-details.component';
import { FilterResponse, FilterTable } from '../../../../shared/models/table-filter.model';
import { ToastrService } from 'ngx-toastr';
import { TracerActionsService } from '../../services/trace-actions.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TraceAction } from '../../models/trace-action.model';
import { ApiResponse, DEFAULT_PAGE_SIZE, DEFAULT_PAGINATION_SIZE } from 'src/app/core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

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
  displayedColumns = ['fecha', 'ip', 'usuario', 'evento', 'objeto'];
  columnsName = ['Fecha', 'IP', 'Usuario', 'Evento', 'Objeto'];
  filters = {};

  rowActionButtons = [
    {
      tooltipText: 'Detalles ',
      icon: 'visibility',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openDetailForm(item),
    },
  ];

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
    {
      name: 'objeto',
      type: 'text',
      title: 'Objeto',
    },
  ];

  constructor(private traceActionService: TracerActionsService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getTraceActions();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getTraceActions(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    const sub = this.traceActionService
      .getTracesActions(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<TraceAction>) => {
          this.traceActions = response.results;
          this.dataCount = response.count;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los datos. Por favor, int??ntelo de nuevo m??s tarde.', 'Error');
          return null;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  onChangePage(page: PageEvent) {
    this.getTraceActions(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getTraceActions(filters, 'id', 'desc');
  }

  onChangeSort(sort: Sort) {
    this.getTraceActions(this.filters, sort.active, sort.direction);
  }

  openDetailForm(item) {
    let dialogRef: MatDialogRef<ActionDetailsComponent, any>;

    dialogRef = this.dialog.open(ActionDetailsComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '1200px',
      minWidth: '300px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        action: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ActionDetailsComponent;
  }
}
