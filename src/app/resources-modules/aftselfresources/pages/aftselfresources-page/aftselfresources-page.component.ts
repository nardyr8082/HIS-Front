import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ResourceType } from '../../../type/models/type';
import { ResourceTypeService } from '../../../type/services/type.service';
import { Aftselfresources, Patient } from '../../models/aftselfresources.model';
import { Aftselfresources_TABLE_CONFIGURATION } from '../../models/aftselfresources-table-configuration';
import { AftselfresourcesService } from '../../services/aftselfresources.service';
import { AftselfresourcesFormComponent } from '../../components/aftselfresources-form/aftselfresources-form.component';
import { Status } from 'tslint/lib/runner';
import { ResourceStatus } from '../../../status/models/resource-status.model';
import { Office } from '../../../../structure-modules/office/models/office.model';
import { Clasificator } from '../../../classificator/models/clasificator.model';

@Component({
  selector: 'app-aftselfresources-page',
  templateUrl: './aftselfresources-page.component.html',
  styleUrls: ['./aftselfresources-page.component.scss'],
})
export class AftselfresourcesPageComponent implements OnInit {
  aftselfresources: Aftselfresources[];
  dataCount = 0;
  configuration = Aftselfresources_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Recurso Propio',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Recurso Propio',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteAftselfresources(item),
    },
  ];

  constructor(private typeServices: ResourceTypeService, private aftselfresourcesService: AftselfresourcesService, private toastService: ToastrService, public dialog: MatDialog) {
    this.putTypes();
  }

  ngOnInit(): void {
    this.getAftselfresources();
  }

  putTypes(filters = {}) {
    const sub = this.typeServices
      .getResourceTypes(filters, 'descripcion', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[1].items = response.results.map((res) => ({ id: res.id, name: res.descripcion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  getAftselfresources(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.aftselfresourcesService
      .getAftselfresources(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Aftselfresources>) => {
          this.aftselfresources = response.results.map((response) => {
            const estadoString = this.getStatusString(response.id_estado);
            const recursoString = this.getResourcesString(response.id_recurso);
            const departamentoString = this.getOfficeString(response.id_departamento);
            const pacienteString = this.getPatientString(response.paciente);
            return { ...response, id_estado_string: estadoString, id_recurso_string: recursoString, id_departamento_string: departamentoString, paciente: pacienteString };
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
  getStatusString(status: ResourceStatus) {
    return status.id;
  }
  getResourcesString(clasificator: Clasificator) {
    return clasificator.id;
  }
  getOfficeString(office: Office) {
    return office.id;
  }
  getPatientString(patient: Patient) {
    return patient.id;
  }
  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getAftselfresources(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getAftselfresources(filters, 'id', 'desc');
  }

  createAftselfresources() {
    let dialogRef: MatDialogRef<AftselfresourcesFormComponent, any>;

    dialogRef = this.dialog.open(AftselfresourcesFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        aftselfresources: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as AftselfresourcesFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((aftselfresources: Aftselfresources) =>
          this.aftselfresourcesService.createAftselfresources(aftselfresources).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Recurso Propio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getAftselfresources(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Recurso Propio fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<AftselfresourcesFormComponent, any>;

    dialogRef = this.dialog.open(AftselfresourcesFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        aftselfresources: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as AftselfresourcesFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((aftselfresources: Aftselfresources) =>
          this.aftselfresourcesService.editAftselfresources({ ...aftselfresources, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Recurso Propio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getAftselfresources(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Recurso Propio fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteAftselfresources(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Recurso Propio: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.aftselfresourcesService.deleteAftselfresources(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Recurso Propio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getAftselfresources(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Recurso Propio fue eliminado correctamente.', 'Felicidades');
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
    this.getAftselfresources(this.filters, sort.active, sort.direction);
  }
}
