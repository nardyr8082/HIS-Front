import { CatScienceService } from '../../services/cat-science.service';
import { CAT_SCIENCE_TABLE_CONFIGURATION } from '../../models/cat-science-table-configuration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { CatScience } from '../../models/cat-science.model';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CatScienceFormComponent } from '../../components/cat-science-form/cat-science-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-cat-science-page',
  templateUrl: './cat-science-page.component.html',
  styleUrls: ['./cat-science-page.component.scss'],
})
export class CatSciencePageComponent implements OnInit, OnDestroy {
  catScience: CatScience[];
  dataCount = 0;
  configuration = CAT_SCIENCE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;

  rowActionButtons = [
    {
      tooltipText: 'Editar Categoría Científica',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Categoría Científica',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteCatScience(item),
    },
  ];

  constructor(private catScienceService: CatScienceService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getCatScience();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getCatScience(filters = this.filters, sortColumn = 'fecha', sortDirection = 'desc', page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    this.loading = true;
    const sub = this.catScienceService
      .getCatScience(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<CatScience>) => {
          this.catScience = response.results;
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
    this.getCatScience(this.filters, 'fecha', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getCatScience(filters, 'fecha', 'desc');
  }

  createCatScience() {
    let dialogRef: MatDialogRef<CatScienceFormComponent, any>;

    dialogRef = this.dialog.open(CatScienceFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        catScience: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as CatScienceFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((catScience: CatScience) =>
          this.catScienceService.createCatScience(catScience).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la categoría científica. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCatScience();
                this.toastService.success('La categoría científica fue creada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<CatScienceFormComponent, any>;

    dialogRef = this.dialog.open(CatScienceFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        catScience: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as CatScienceFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((catScience: CatScience) =>
          this.catScienceService.editCatScience({ ...catScience, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la categoría científica. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCatScience();
                this.toastService.success('La categoría científica fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteCatScience(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `Está seguro que desea eliminar la categoría científica: ${item.descripcion}`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.catScienceService.deleteCatScience(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la categoría científica. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCatScience();
                this.toastService.success('La categoría científica fue eliminado correctamente.', 'Felicidades');
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
    this.getCatScience(this.filters, sort.active, sort.direction);
  }
}
