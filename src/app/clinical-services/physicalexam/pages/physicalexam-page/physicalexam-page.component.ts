import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { PhysicalexamFormComponent } from '../../components/physicalexam-form/physicalexam-form.component';
import { Physicalexam } from '../../models/physicalexam.model';
import { PhysicalexamService } from '../../services/physicalexam.service';
import { Physicalexam_TABLE_CONFIGURATION } from '../../models/physicalexam-table-configuration';



@Component({
  selector: 'app-physicalexam-page',
  templateUrl: './physicalexam-page.component.html',
  styleUrls: ['./physicalexam-page.component.scss'],
})
export class PhysicalexamPageComponent implements OnInit, OnDestroy {
  physicalexam: Physicalexam[];
  dataCount = 0;
  configuration = Physicalexam_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Examén Físico',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Examén Físico',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deletePhysicalexam(item),
    },
  ];

  constructor(
    private physicalexamService: PhysicalexamService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.getClinicSession();
  }

  ngOnInit(): void {
    this.getPhysicalexam();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  getClinicSession(filters = {}) {
    const sub = this.physicalexamService
      .getClinicSession()
      .pipe(
        map((response) => {
          console.log('ver estos ya:', response);
          this.configuration.tableFilters[12].items = response.results.map((res) => ({ id: res.id, name: res.motivo }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  
  getPhysicalexam(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.physicalexamService
      .getPhysicalexam(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          console.log('mi response: ', response);
          this.physicalexam = response.results.map((res) => ({
            ...res,
            sesion_clinica_string: res.sesion_clinica.motivo,
          }));
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
    this.getPhysicalexam(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getPhysicalexam(filters, 'id', 'desc');
  }

  createPhysicalexam() {
    let dialogRef: MatDialogRef<PhysicalexamFormComponent, any>;

    dialogRef = this.dialog.open(PhysicalexamFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        physicalexam: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as PhysicalexamFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((physicalexam: Physicalexam) =>
          this.physicalexamService.createPhysicalexam(physicalexam).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Examén Físico. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPhysicalexam(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Examén Físico fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<PhysicalexamFormComponent, any>;

    dialogRef = this.dialog.open(PhysicalexamFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        physicalexam: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as PhysicalexamFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((physicalexam: Physicalexam) =>
          this.physicalexamService.editPhysicalexam({ ...physicalexam, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Examén Físico. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPhysicalexam(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Examén Físico fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deletePhysicalexam(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Examén Físico?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.physicalexamService.deletePhysicalexam(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Examén Físico. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPhysicalexam(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Examén Físico fue eliminado correctamente.', 'Felicidades');
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
    this.getPhysicalexam(this.filters, sort.active, sort.direction);
  }
}
