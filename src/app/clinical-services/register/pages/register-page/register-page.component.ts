import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { Register } from '../../models/register.model';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';
import { Register_TABLE_CONFIGURATION } from '../../models/register-table-configuration';
import { RegisterService } from '../../services/register.service';


@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  register: Register[];
  dataCount = 0;
  configuration = Register_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Registro',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Registro',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteRegister(item),
    },
  ];

  constructor(
    private registerService: RegisterService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.getClinicSession();
  }

  ngOnInit(): void {
    this.getRegister();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  getClinicSession(filters = {}) {
    const sub = this.registerService
      .getClinicSession()
      .pipe(
        map((response) => {
          console.log('ver estos ya:', response);
          this.configuration.tableFilters[0].items = response.results.map((res) => ({ id: res.id, name: res.motivo }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }



  getRegister(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.registerService
      .getRegister(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          console.log('mi response: ', response);
          this.register = response.results.map((res) => ({
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
    this.getRegister(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getRegister(filters, 'id', 'desc');
  }

  createRegister() {
    let dialogRef: MatDialogRef<RegisterFormComponent, any>;

    dialogRef = this.dialog.open(RegisterFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        register: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as RegisterFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((register: Register) =>
          this.registerService.createRegister(register).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Registro. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getRegister(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Registro fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<RegisterFormComponent, any>;

    dialogRef = this.dialog.open(RegisterFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        register: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as RegisterFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((register: Register) =>
          this.registerService.editRegister({ ...register, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Registro. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getRegister(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Registro fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteRegister(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Registro?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.registerService.deleteRegister(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Registro. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getRegister(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Registro fue eliminado correctamente.', 'Felicidades');
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
    this.getRegister(this.filters, sort.active, sort.direction);
  }
}
