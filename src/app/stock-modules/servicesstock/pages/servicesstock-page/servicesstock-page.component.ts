import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { Servicesstock } from '../../models/servicesstock.model';
import { Servicesstock_TABLE_CONFIGURATION } from '../../models/servicesstock-table-configuration';
import { ServicesstockFormComponent } from '../../components/servicesstock-form/servicesstock-form.component';
import { ServicesstockService } from '../../services/servicesstock.service';
import { Office } from '../../../../structure-modules/office/models/office.model';



@Component({
  selector: 'app-servicesstock-page',
  templateUrl: './servicesstock-page.component.html',
  styleUrls: ['./servicesstock-page.component.scss'],
})
export class ServicesstockPageComponent implements OnInit, OnDestroy {
  servicesstock: Servicesstock[];
  dataCount = 0;
  configuration = Servicesstock_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Servicio Almacén',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Servicio Almacén',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteServicesstock(item),
    },
  ];

  constructor(private servicesstockService: ServicesstockService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getServicesstock();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getServicesstock(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.servicesstockService
      .getServicesstock(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          console.log('QUE !!!: ', response);
          this.servicesstock = response.results.map((res) => {
            console.log('YA !!!: ', res);
            const departamento_string = this.getOfficeString(res.departamento);
            const impuesto_string = this.getTaxstring(res.impuesto);
            const usuario_string = this.getUserString(res.usuario);
            return { ...res, impuesto_string: impuesto_string, usuario_string: usuario_string, departamento_string: departamento_string  };
          });
          this.dataCount = response.count;
          this.loading = false;
        }),
        catchError(() => {
          this.toastService.error('Hubo OJO!!! un error al obtener los datos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          this.loading = false;
          return null;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getOfficeString(office: Office[]) {
    let departamento_string = '';
    office.forEach((off) => {
      departamento_string = departamento_string.concat(`${off.nombre}, `);
    });
    return departamento_string.substring(0, departamento_string.length - 2);
  }

  getUserString(user: any) {
    return user.username;
  }

  getTaxstring(imp: any) {
    return imp.descripcion;
  }

  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getServicesstock(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getServicesstock(filters, 'id', 'desc');
  }

  createServicesstock() {
    let dialogRef: MatDialogRef<ServicesstockFormComponent, any>;

    dialogRef = this.dialog.open(ServicesstockFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        servicesstock: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ServicesstockFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((servicesstock: Servicesstock) =>
          this.servicesstockService.createServicesstock(servicesstock).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Servicio Almacén. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getServicesstock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Servicio Almacén fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<ServicesstockFormComponent, any>;

    dialogRef = this.dialog.open(ServicesstockFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        servicesstock: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as ServicesstockFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((servicesstock: Servicesstock) =>
          this.servicesstockService.editServicesstock({ ...servicesstock, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Servicio Almacén. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getServicesstock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Servicio Almacén fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteServicesstock(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el servicio alamcén: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.servicesstockService.deleteServicesstock(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Servicio Almacén. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getServicesstock(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Servicio Almacén fue eliminado correctamente.', 'Felicidades');
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
    this.getServicesstock(this.filters, sort.active, sort.direction);
  }
}
