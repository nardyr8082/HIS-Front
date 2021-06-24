import { Component, OnInit } from '@angular/core';
import { HealthUnitService } from '../../services/health-unit.service';
import { HEALTH_UNIT_TABLE_CONFIGURATION } from './../../models/health-unit-table-configuration';
import { HealthUnit } from './../../models/health-unit.model';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { HealthUnitFormComponent } from '../../components/health-unit-form/health-unit-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-health-unit-page',
  templateUrl: './health-unit-page.component.html',
  styleUrls: ['./health-unit-page.component.scss'],
})
export class HealthUnitPageComponent implements OnInit {
  healthUnits: HealthUnit[];
  dataCount = 0;
  configuration = HEALTH_UNIT_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;

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
      callback: (item) => this.deleteHealthUnit(item),
    },
  ];

  constructor(private healthUnitService: HealthUnitService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getHealthUnits();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getHealthUnits(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    this.loading = true;
    const sub = this.healthUnitService
      .getHealthUnits(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.healthUnits = response.results.map((response) => {
            const nivel = response.nivel ? response.nivel.name : '';
            const nivel_id = response.nivel ? response.nivel.id : '';
            return { ...response, nivel: nivel, nivel_id: nivel_id };
          });
          this.dataCount = response.count;
          this.loading = false;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los datos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          this.loading = false;
          return of(null);
        }),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  onChangePage(page: PageEvent) {
    this.getHealthUnits(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getHealthUnits(filters, 'id', 'desc');
  }

  createHealthUnit() {
    let dialogRef: MatDialogRef<HealthUnitFormComponent, any>;

    dialogRef = this.dialog.open(HealthUnitFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        healthUnit: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as HealthUnitFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((healthUnit: HealthUnit) =>
          this.healthUnitService.createHealthUnit(healthUnit).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la unidad de salud. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getHealthUnits();
                this.toastService.success('La unidad de salud fue creada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<HealthUnitFormComponent, any>;

    dialogRef = this.dialog.open(HealthUnitFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        healthUnit: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as HealthUnitFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((healthUnit: HealthUnit) =>
          this.healthUnitService.editHealthUnit({ ...healthUnit, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la unidad de salud. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getHealthUnits();
                this.toastService.success('La unidad de salud fue modificada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  deleteHealthUnit(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `Está seguro que desea eliminar la unidad de salud: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.healthUnitService.deleteHealthUnit(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la unidad de salud. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getHealthUnits();
                this.toastService.success('La unidad de salud fue eliminada correctamente.', 'Felicidades');
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
    this.getHealthUnits(this.filters, sort.active, sort.direction);
  }
}
