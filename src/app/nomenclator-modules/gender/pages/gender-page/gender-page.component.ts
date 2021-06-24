import { GenderService } from '../../services/gender.service';
import { GENDER_TABLE_CONFIGURATION } from '../../models/gender-table-configuration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { Gender } from '../../models/gender.model';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GenderFormComponent } from '../../components/gender-form/gender-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-gender-page',
  templateUrl: './gender-page.component.html',
  styleUrls: ['./gender-page.component.scss'],
})
export class GenderPageComponent implements OnInit, OnDestroy {
  genders: Gender[];
  dataCount = 0;
  configuration = GENDER_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;

  rowActionButtons = [
    {
      tooltipText: 'Editar Sexo',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Sexo',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteGender(item),
    },
  ];

  constructor(private genderService: GenderService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getGenders();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getGenders(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    this.loading = true;
    const sub = this.genderService
      .getGenders(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Gender>) => {
          this.genders = response.results;
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
    this.getGenders(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getGenders(filters, 'id', 'desc');
  }

  createGender() {
    let dialogRef: MatDialogRef<GenderFormComponent, any>;

    dialogRef = this.dialog.open(GenderFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        gender: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as GenderFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((gender: Gender) =>
          this.genderService.createGender(gender).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el sexo. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getGenders();
                this.toastService.success('El sexo fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<GenderFormComponent, any>;

    dialogRef = this.dialog.open(GenderFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        gender: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as GenderFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((gender: Gender) =>
          this.genderService.editGender({ ...gender, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el sexo. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getGenders();
                this.toastService.success('El sexo fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteGender(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `Está seguro que desea eliminar el sexo: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.genderService.deleteGender(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el sexo. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getGenders();
                this.toastService.success('El sexo fue eliminado correctamente.', 'Felicidades');
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
    this.getGenders(this.filters, sort.active, sort.direction);
  }
}
