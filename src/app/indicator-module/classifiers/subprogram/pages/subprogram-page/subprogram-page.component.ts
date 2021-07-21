import { SubprogramService } from './../../services/subprogram.service';
import { SUBPROGRAM_TABLE_CONFIGURATION } from './../../models/subprogram-table-configuration';
import { Subprogram } from './../../models/subprogram.model';
import { Indicator } from '../../../../../indicator-module/indicator/models/indicator.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../../core/models/api-response.model';
import { SubprogramFormComponent } from '../../components/subprogram-form/subprogram-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-subprogram-page',
  templateUrl: './subprogram-page.component.html',
  styleUrls: ['./subprogram-page.component.scss'],
})
export class SubprogramPageComponent implements OnInit, OnDestroy {
  subprogram: Subprogram[];
  dataCount = 0;
  configuration = SUBPROGRAM_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Subprograma',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Subprograma',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteSubprogram(item),
    },
  ];

  constructor(
    private subprogramService: SubprogramService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.getPrograma();
    this.getIndicador();
  }

  ngOnInit(): void {
    this.getSubprogram();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getPrograma(filters = {}) {
    const sub = this.subprogramService
      .getPrograma()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[2].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getIndicador(filters = {}) {
    const sub = this.subprogramService
      .getIndicador()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[3].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getSubprogram(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.subprogramService
      .getSubprogram(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.subprogram = response.results.map((res) => ({
            ...res,
            indicador_id: res.indicador.id,
            programa_descrip: res.programa.descripcion,
            programa_id: res.programa.id,
            indicador_nombre: this.getIndicatorString(res.indicador),
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

  getIndicatorString(indicadores: Indicator[]) {
    let indicador_nombre = '';
    indicadores.forEach((indicador) => {
      indicador_nombre = indicador_nombre.concat(`${indicador.nombre}, `);
    });
    // To remove the last blank space and comma
    return indicador_nombre.substring(0, indicador_nombre.length - 2);
  }

  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getSubprogram(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getSubprogram(filters, 'id', 'desc');
  }

  createSubprogram() {
    let dialogRef: MatDialogRef<SubprogramFormComponent, any>;

    dialogRef = this.dialog.open(SubprogramFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        subprogram: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as SubprogramFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((subprogram: Subprogram) =>
          this.subprogramService.createSubprogram(subprogram).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el subprograma. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSubprogram(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El subprograma fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<SubprogramFormComponent, any>;

    dialogRef = this.dialog.open(SubprogramFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        subprogram: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as SubprogramFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((subprogram: Subprogram) =>
          this.subprogramService.editSubprogram({ ...subprogram, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el subprograma. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSubprogram(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El subprograma fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteSubprogram(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el subprograma: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.subprogramService.deleteSubprogram(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el subprograma. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSubprogram(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El subprograma fue eliminado correctamente.', 'Felicidades');
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
    this.getSubprogram(this.filters, sort.active, sort.direction);
  }
}
