import { BloodTypeService } from '../../services/blood-type.service';
import { BLOOD_TYPE_TABLE_CONFIGURATION } from '../../models/blood-type-table-configuration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { BloodType } from '../../models/blood-type.model';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BloodTypeFormComponent } from '../../components/blood-type-form/blood-type-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-blood-type-page',
  templateUrl: './blood-type-page.component.html',
  styleUrls: ['./blood-type-page.component.scss'],
})
export class BloodTypePageComponent implements OnInit, OnDestroy {
  bloodType: BloodType[];
  dataCount = 0;
  configuration = BLOOD_TYPE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Grupo Sangíneo',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Grupo Sangíneo',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteBloodType(item),
    },
  ];

  constructor(private bloodTypeService: BloodTypeService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getBloodType();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getBloodType(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.bloodTypeService
      .getBloodType(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<BloodType>) => {
          this.bloodType = response.results;
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
    this.getBloodType(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getBloodType(filters, 'id', 'desc');
  }

  createBloodType() {
    let dialogRef: MatDialogRef<BloodTypeFormComponent, any>;

    dialogRef = this.dialog.open(BloodTypeFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        bloodType: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as BloodTypeFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((bloodType: BloodType) =>
          this.bloodTypeService.createBloodType(bloodType).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el grupo sangíneo. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getBloodType(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El grupo sangíneo fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<BloodTypeFormComponent, any>;

    dialogRef = this.dialog.open(BloodTypeFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        bloodType: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as BloodTypeFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((bloodType: BloodType) =>
          this.bloodTypeService.editBloodType({ ...bloodType, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el grupo sangíneo. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getBloodType(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El grupo sangíneo fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteBloodType(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el grupo sangíneo: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.bloodTypeService.deleteBloodType(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el grupo sangíneo. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getBloodType(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El grupo sangíneo fue eliminado correctamente.', 'Felicidades');
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
    this.getBloodType(this.filters, sort.active, sort.direction);
  }
}
