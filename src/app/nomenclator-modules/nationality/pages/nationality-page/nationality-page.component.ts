import { NationalityService } from '../../services/nationality.service';
import { NATIONALITY_TABLE_CONFIGURATION } from '../../models/nationality-table-configuration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { Nationality } from '../../models/nationality.model';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NationalityFormComponent } from '../../components/nationality-form/nationality-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-nationality-page',
  templateUrl: './nationality-page.component.html',
  styleUrls: ['./nationality-page.component.scss'],
})
export class NationalityPageComponent implements OnInit, OnDestroy {
  nationalities: Nationality[];
  dataCount = 0;
  configuration = NATIONALITY_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Nacionalidad',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Nacionalidad',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteNationality(item),
    },
  ];

  constructor(private nationalityService: NationalityService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getNationalities();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getNationalities(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.nationalityService
      .getNationalities(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Nationality>) => {
          this.nationalities = response.results;
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
    this.getNationalities(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getNationalities(filters, 'id', 'desc');
  }

  createNationality() {
    let dialogRef: MatDialogRef<NationalityFormComponent, any>;

    dialogRef = this.dialog.open(NationalityFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        nationality: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as NationalityFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((nationality: Nationality) =>
          this.nationalityService.createNationality(nationality).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la nacionalidad. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getNationalities(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La nacionalidad fue creada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<NationalityFormComponent, any>;

    dialogRef = this.dialog.open(NationalityFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        nationality: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as NationalityFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((nationality: Nationality) =>
          this.nationalityService.editNationality({ ...nationality, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la nacionalidad. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getNationalities(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La nacionalidad fue modificada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteNationality(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la nacionalidad: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.nationalityService.deleteNationality(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la nacionalidad. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getNationalities(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La nacionalidad fue eliminada correctamente.', 'Felicidades');
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
    this.getNationalities(this.filters, sort.active, sort.direction);
  }
}
