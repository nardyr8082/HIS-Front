import { ToastrService } from 'ngx-toastr';
import { DiseaseService } from './../../services/disease.service';
import { DISEASE_TABLE_CONFIGURATION } from './../../models/disease-table-configuration';
import { Disease } from './../../models/disease.model';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { DiseaseFormComponent } from '../../components/disease-form/disease-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-disease-page',
  templateUrl: './disease-page.component.html',
  styleUrls: ['./disease-page.component.scss'],
})
export class DiseasePageComponent implements OnInit {
  diseases: Disease[];
  dataCount = 0;
  configuration = DISEASE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Enfermedad',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Enfermedad',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteDisease(item),
    },
  ];

  constructor(private diseaseService: DiseaseService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getDiseases();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getDiseases(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.diseaseService
      .getDiseases(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Disease>) => {
          this.diseases = response.results;
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
    this.getDiseases(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getDiseases(filters, 'id', 'desc');
  }

  createDisease() {
    let dialogRef: MatDialogRef<DiseaseFormComponent, any>;

    dialogRef = this.dialog.open(DiseaseFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        disease: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as DiseaseFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((disease: Disease) =>
          this.diseaseService.createDisease(disease).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la enfermedad. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getDiseases(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La enfermedad fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<DiseaseFormComponent, any>;

    dialogRef = this.dialog.open(DiseaseFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        disease: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as DiseaseFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((disease: Disease) =>
          this.diseaseService.editDisease({ ...disease, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la enfermedad. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getDiseases(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La enfermedad fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteDisease(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la enfermedad: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.diseaseService.deleteDisease(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la enfermedad. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getDiseases(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La enfermedad fue eliminada correctamente.', 'Felicidades');
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
    this.getDiseases(this.filters, sort.active, sort.direction);
  }
}
