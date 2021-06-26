import { DepartamentService } from './../../services/departament.service';
import { RoleService } from './../../../../security-module/role/services/role.service';
import { HealthUnitService } from './../../../health-unit/services/health-unit.service';
import { Sort } from '@angular/material/sort';
import { DeleteConfirmationModalComponent } from './../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { WorkStationFormComponent } from './../../components/work-station-form/work-station-form.component';
import { ApiResponse, DEFAULT_PAGE_SIZE } from './../../../../core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { WorkStationService } from '../../services/office.service';
import { Subscription, of } from 'rxjs';
import { WORK_STATION_TABLE_CONFIGURATION } from './../../models/work-station-table-configuration';
import { WorkStation } from './../../models/work-station.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { LevelService } from 'src/app/structure-modules/health-unit/services/level.service';

@Component({
  selector: 'app-work-station-page',
  templateUrl: './work-station-page.component.html',
  styleUrls: ['./work-station-page.component.scss'],
})
export class WorkStationPageComponent implements OnInit, OnDestroy {
  workStations: WorkStation[];
  dataCount = 0;
  configuration = WORK_STATION_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;

  rowActionButtons = [
    {
      tooltipText: 'Editar Puesto de Trabajo',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Puesto de Trabajo',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteWorkStation(item),
    },
  ];

  constructor(
    private workStationService: WorkStationService,
    private toastService: ToastrService,
    public dialog: MatDialog,
    private healthUnitService: HealthUnitService,
    private levelService: LevelService,
    private roleService: RoleService,
    private departamentService: DepartamentService,
  ) {
    this.putLevelsInFilter();
    this.putHealthUnits();
    this.putRoleService();
    this.putDepartamentsInFIlters();
  }

  ngOnInit(): void {
    this.getWorkStations();
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

  putDepartamentsInFIlters(filters = {}) {
    const sub = this.departamentService
      .getDepartaments(filters, 'nombre', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[3].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  putRoleService() {
    const sub = this.roleService
      .getRoles({}, 'name', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[4].items = response.results.map((res) => ({ id: res.id, name: res.name }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getWorkStations(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    this.loading = true;
    const sub = this.workStationService
      .getWorkStations(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<WorkStation>) => {
          this.workStations = response.results.map((res) => {
            return { ...res, rol_text: res.rol.name, departamento_text: res.departamento.name };
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
    this.getWorkStations(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getWorkStations(filters, 'id', 'desc');
    if (this.filters['nivel__id']) {
      this.putHealthUnits({ nivel__id: this.filters['nivel__id'] });
    }
    if (this.filters['unidad__id']) {
      this.putDepartamentsInFIlters({ unidad__id: this.filters['nivel__id'] });
    }
  }

  createWorkStation() {
    let dialogRef: MatDialogRef<WorkStationFormComponent, any>;

    dialogRef = this.dialog.open(WorkStationFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        workStation: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as WorkStationFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((workStation: WorkStation) =>
          this.workStationService.createWorkStation(workStation).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el puesto de trabajo. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getWorkStations();
                this.toastService.success('El puesto de trabajo fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<WorkStationFormComponent, any>;

    dialogRef = this.dialog.open(WorkStationFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        workStation: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as WorkStationFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((workStation: WorkStation) =>
          this.workStationService.editWorkStation({ ...workStation, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el puesto de trabajo. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getWorkStations();
                this.toastService.success('El puesto de trabajo fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteWorkStation(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el puesto de trabajo: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.workStationService.deleteWorkStation(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el puesto de trabajo. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getWorkStations();
                this.toastService.success('El puesto de trabajo fue eliminado correctamente.', 'Felicidades');
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
    this.getWorkStations(this.filters, sort.active, sort.direction);
  }
}
