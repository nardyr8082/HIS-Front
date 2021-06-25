import { ProfessionFormComponent } from './../../components/profession-form/profession-form.component';
import { ProfessionService } from './../../services/profession.service';
import { PROFESSION_TABLE_CONFIGURATION } from './../../models/profession-table-configuration';
import { Profession } from './../../models/profession.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-profession-page',
  templateUrl: './profession-page.component.html',
  styleUrls: ['./profession-page.component.scss'],
})
export class ProfessionPageComponent implements OnInit, OnDestroy {
  profession: Profession[];
  dataCount = 0;
  configuration = PROFESSION_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;

  rowActionButtons = [
    {
      tooltipText: 'Editar Profesión',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Profesión',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteProfession(item),
    },
  ];

  constructor(private professionService: ProfessionService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getProfession();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getProfession(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    this.loading = true;
    const sub = this.professionService
      .getProfession(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Profession>) => {
          this.profession = response.results;
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
    this.getProfession(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getProfession(filters, 'id', 'desc');
  }

  createProfession() {
    let dialogRef: MatDialogRef<ProfessionFormComponent, any>;

    dialogRef = this.dialog.open(ProfessionFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        profession: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ProfessionFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((profession: Profession) =>
          this.professionService.createProfession(profession).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la profesión. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getProfession();
                this.toastService.success('La profesión fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<ProfessionFormComponent, any>;

    dialogRef = this.dialog.open(ProfessionFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        profession: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ProfessionFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((profession: Profession) =>
          this.professionService.editProfession({ ...profession, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la profesión. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getProfession();
                this.toastService.success('La profesión fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteProfession(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `Está seguro que desea eliminar la profesión: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.professionService.deleteProfession(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la profesión. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getProfession();
                this.toastService.success('La profesión fue eliminada correctamente.', 'Felicidades');
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
    this.getProfession(this.filters, sort.active, sort.direction);
  }
}
