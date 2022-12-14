import { LevelService } from './../../../health-unit/services/level.service';
import { HealthUnitService } from './../../../health-unit/services/health-unit.service';
import { OfficeService } from './../../services/office.service';
import { ORG_LEVEL_TABLE_CONFIGURATION } from './../../models/office-table-configuration';
import { Office } from './../../models/office.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { OfficeFormComponent } from '../../components/office-form/office-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-office-page',
  templateUrl: './office-page.component.html',
  styleUrls: ['./office-page.component.scss'],
})
export class OfficePageComponent implements OnInit, OnDestroy {
  office: Office[];
  dataCount = 0;
  configuration = ORG_LEVEL_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Unidad de Salud',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Unidad de Salud',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteOffice(item),
    },
  ];

  constructor(
    private officeService: OfficeService,
    private toastService: ToastrService,
    public dialog: MatDialog,
    private healthUnitService: HealthUnitService,
    private levelService: LevelService,
  ) {
    this.putLevelsInFilter();
    this.putHealthUnits();
  }

  ngOnInit(): void {
    this.getOffice();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  putLevelsInFilter() {
    const sub = this.levelService
      .getAllLevels()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[1].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  putHealthUnits(filters = {}) {
    const sub = this.healthUnitService
      .getHealthUnits(filters, 'nombre', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[2].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getOffice(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.officeService
      .getOffice(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.office = response.results.map((response) => {
            const unidad = response.unidad ? response.unidad.name : '';
            const unidad_id = response.unidad ? response.unidad.id : '';
            return { ...response, unidad: unidad, unidad_id: unidad_id };
          });
          this.dataCount = response.count;
          this.loading = false;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los datos. Por favor, int??ntelo de nuevo m??s tarde.', 'Error');
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
    this.getOffice(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getOffice(filters, 'id', 'desc');
    if (this.filters['nivel__id']) {
      this.putHealthUnits({ nivel__id: this.filters['nivel__id'] });
    }
  }

  createOffice() {
    let dialogRef: MatDialogRef<OfficeFormComponent, any>;

    dialogRef = this.dialog.open(OfficeFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        office: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as OfficeFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((office: Office) =>
          this.officeService.createOffice(office).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el departamento. Por favor, int??ntelo de nuevo m??s tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getOffice(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El departamento fue creada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<OfficeFormComponent, any>;

    dialogRef = this.dialog.open(OfficeFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        office: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as OfficeFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((office: Office) =>
          this.officeService.editOffice({ ...office, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el departamento. Por favor, int??ntelo de nuevo m??s tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getOffice(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El departamento fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteOffice(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `??Est?? seguro que desea eliminar el departamento: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.officeService.deleteOffice(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el departamento. Por favor, int??ntelo de nuevo m??s tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getOffice(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El departamento fue eliminado correctamente.', 'Felicidades');
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
    this.getOffice(this.filters, sort.active, sort.direction);
  }
}
