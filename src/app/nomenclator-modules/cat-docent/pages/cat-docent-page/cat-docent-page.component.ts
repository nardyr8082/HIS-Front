import { Component, OnInit, OnDestroy } from '@angular/core';
import { CatDocentService } from '../../services/cat-docent.service';
import { CAT_DOCENT_TABLE_CONFIGURATION } from 'src/app/nomenclator-modules/cat-docent/models/cat-docent-table-configuration';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { CatDocentFormComponent } from '../../components/cat-docent-form/cat-docent-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { CatDocent } from '../../models/cat-docent.model';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';


@Component({
  selector: 'app-cat-docent-page',
  templateUrl: './cat-docent-page.component.html',
  styleUrls: ['./cat-docent-page.component.scss']
})
export class CatDocentPageComponent implements OnInit, OnDestroy {

  catDocent: CatDocent[];
  dataCount = 0;
  configuration = CAT_DOCENT_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;

  rowActionButtons = [
    {
      tooltipText: 'Editar Categoría Docente',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Categoría Docente',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteCatDocent(item),
    },
  ];

  constructor(private catDocentService: CatDocentService, private toastService: ToastrService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCatDocent();
    console.log(`catDocent: ${this.catDocent}`);
    console.log(this.dialog);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getCatDocent(filters = this.filters, sortColumn = 'fecha', sortDirection = 'desc', page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    this.loading = true;
    const sub = this.catDocentService
      .getCatDocent(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<CatDocent>) => {
          this.catDocent = response.results;
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
    this.getCatDocent(this.filters, 'fecha', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getCatDocent(filters, 'fecha', 'desc');
  }

  createCatDocent() {
    let dialogRef: MatDialogRef<CatDocentFormComponent, any>;

    dialogRef = this.dialog.open(CatDocentFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        catDocent: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as CatDocentFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((catDocent: CatDocent) =>
          this.catDocentService.createCatDocent(catDocent).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la categoría docente. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCatDocent();
                this.toastService.success('La categoría docente fue creada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<CatDocentFormComponent, any>;

    dialogRef = this.dialog.open(CatDocentFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        catDocent: item,
      },
    });
    console.log(item);
    const modalComponentRef = dialogRef.componentInstance as CatDocentFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((catDocent: CatDocent) =>
          this.catDocentService.editCatDocent({ ...catDocent, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la categoría docente. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCatDocent();
                this.toastService.success('La categoría docente fue modificada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  deleteCatDocent(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `Está seguro que desea eliminar la categoría docente: ${item.descripcion}`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.catDocentService.deleteCatDocent(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la categoría docente. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCatDocent();
                this.toastService.success('La categoría docente fue eliminado correctamente.', 'Felicidades');
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
    this.getCatDocent(this.filters, sort.active, sort.direction);
  }
}
