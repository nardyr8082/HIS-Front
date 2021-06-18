import { MunicipalityService } from '../../services/municipality.service';
import { MUNICIPALITY_TABLE_CONFIGURATION } from '../../models/municipality-table-configuration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { Municipality } from '../../models/municipality.model';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MunicipalityFormComponent } from '../../components/municipality-form/municipality-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-municipality-page',
  templateUrl: './municipality-page.component.html',
  styleUrls: ['./municipality-page.component.scss'],
})
export class MunicipalityPageComponent implements OnInit, OnDestroy {
  municipalities: Municipality[];
  dataCount = 0;
  configuration = MUNICIPALITY_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;

  rowActionButtons = [
    {
      tooltipText: 'Editar Municipio',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Municipio',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteMunicipality(item),
    },
  ];

  constructor(private municipalityService: MunicipalityService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getMunicipalities();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getMunicipalities(filters = this.filters, sortColumn = 'fecha', sortDirection = 'desc', page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    this.loading = true;
    const sub = this.municipalityService
      .getMunicipalities(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Municipality>) => {
          this.municipalities = response.results;
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
    this.getMunicipalities(this.filters, 'fecha', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getMunicipalities(filters, 'fecha', 'desc');
  }

  createMunicipality() {
    let dialogRef: MatDialogRef<MunicipalityFormComponent, any>;

    dialogRef = this.dialog.open(MunicipalityFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        municipality: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as MunicipalityFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((municipality: Municipality) =>
          this.municipalityService.createMunicipality(municipality).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el municipio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getMunicipalities();
                this.toastService.success('El municipio fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<MunicipalityFormComponent, any>;

    dialogRef = this.dialog.open(MunicipalityFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        municipality: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as MunicipalityFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((municipality: Municipality) =>
          this.municipalityService.editMunicipality({ ...municipality, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el municipio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getMunicipalities();
                this.toastService.success('El municipio fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteMunicipality(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `Está seguro que desea eliminar el municipio: ${item.nombre}`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.municipalityService.deleteMunicipality(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el municipio. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getMunicipalities();
                this.toastService.success('El municipio fue eliminado correctamente.', 'Felicidades');
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
    this.getMunicipalities(this.filters, sort.active, sort.direction);
  }
}
