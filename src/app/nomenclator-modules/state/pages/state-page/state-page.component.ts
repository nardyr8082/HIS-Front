import { StateService } from './../../services/state.service';
import { STATE_TABLE_CONFIGURATION } from './../../models/state-table-configuration';
import { State } from './../../models/state.model';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StateFormComponent } from '../../components/state-form/state-form.component';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-state-page',
  templateUrl: './state-page.component.html',
  styleUrls: ['./state-page.component.scss'],
})
export class StatePageComponent implements OnInit {
  states: State[];
  dataCount = 0;
  configuration = STATE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Provincia',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Provincia',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteState(item),
    },
  ];

  constructor(private stateService: StateService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getStates();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getStates(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.stateService
      .getStates(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.states = response.results.map( (resp) => {
            const pais = resp.pais ? resp.pais.name : '';
            const pais_id = resp.pais ? resp.pais.id : '';
            return { ...resp, pais: pais, pais_id: pais_id};
          });
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
    this.getStates(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getStates(filters, 'id', 'desc');
  }

  createState() {
    let dialogRef: MatDialogRef<StateFormComponent, any>;

    dialogRef = this.dialog.open(StateFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        state: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as StateFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((state: State) =>
          this.stateService.createState(state).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la provincia. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getStates(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La provincia fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<StateFormComponent, any>;

    dialogRef = this.dialog.open(StateFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        state: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as StateFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((state: State) =>
          this.stateService.editState({ ...state, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la provincia. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getStates(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La provincia fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteState(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la provincia: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.stateService.deleteState(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la provincia. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getStates(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La provincia fue eliminado correctamente.', 'Felicidades');
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
    this.getStates(this.filters, sort.active, sort.direction);
  }
}
