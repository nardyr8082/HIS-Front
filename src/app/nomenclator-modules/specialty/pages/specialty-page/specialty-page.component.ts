import { SpecialtyService } from './../../services/specialty.service';
import { SPECIALTY_TABLE_CONFIGURATION } from './../../models/specialty-table-configuration';
import { Specialty } from './../../models/specialty';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { SpecialtyFormComponent } from '../../components/specialty-form/specialty-form.component';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-specialty-page',
  templateUrl: './specialty-page.component.html',
  styleUrls: ['./specialty-page.component.scss'],
})
export class SpecialtyPageComponent implements OnInit {
  specialties: Specialty[];
  dataCount = 0;
  configuration = SPECIALTY_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;

  rowActionButtons = [
    {
      tooltipText: 'Editar Especialidad',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Especialidad',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteSpecialty(item),
    },
  ];

  constructor(private genderService: SpecialtyService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getSpecialtys();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getSpecialtys(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    this.loading = true;
    const sub = this.genderService
      .getSpecialties(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Specialty>) => {
          this.specialties = response.results;
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
    this.getSpecialtys(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getSpecialtys(filters, 'id', 'desc');
  }

  createSpecialty() {
    let dialogRef: MatDialogRef<SpecialtyFormComponent, any>;

    dialogRef = this.dialog.open(SpecialtyFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        specialty: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as SpecialtyFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((specialty: Specialty) =>
          this.genderService.createSpecialty(specialty).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la especialidad. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSpecialtys();
                this.toastService.success('La especialidad fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<SpecialtyFormComponent, any>;

    dialogRef = this.dialog.open(SpecialtyFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        specialty: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as SpecialtyFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((specialty: Specialty) =>
          this.genderService.editSpecialty({ ...specialty, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la especialidad. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSpecialtys();
                this.toastService.success('La especialidad fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteSpecialty(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `Está seguro que desea eliminar la especialidad: ${item.descripcion}`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.genderService.deleteSpecialty(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la especialidad. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getSpecialtys();
                this.toastService.success('La especialidad fue eliminado correctamente.', 'Felicidades');
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
    this.getSpecialtys(this.filters, sort.active, sort.direction);
  }
}
