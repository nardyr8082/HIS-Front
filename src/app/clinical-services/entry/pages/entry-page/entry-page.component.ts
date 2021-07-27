import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { Entry } from '../../models/entry.model';
import { Entry_TABLE_CONFIGURATION } from '../../models/entry-table-configuration';
import { EntryService } from '../../services/entry.service';
import { EntryFormComponent } from '../../components/entry-form/entry-form.component';
import { AftselfresourcesService } from '../../../../resources-modules/aftselfresources/services/aftselfresources.service';
import { PatientService } from '../../../../patient/services/patient.service';
import { OfficeService } from '../../../../structure-modules/office/services/office.service';
import { UserService } from '../../../../security-module/user/services/user.service';


@Component({
  selector: 'app-entry-page',
  templateUrl: './entry-page.component.html',
  styleUrls: ['./entry-page.component.scss'],
})
export class EntryPageComponent implements OnInit, OnDestroy {
  entry: Entry[];
  dataCount = 0;
  configuration = Entry_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Ingreso',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Ingreso',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteEntry(item),
    },
  ];

  constructor(
    public resouceselfService: AftselfresourcesService,
    public patientService: PatientService,
    public officeService: OfficeService,
    public userService: UserService,
    private entryService: EntryService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.getResouceSelf();
    this.getPatient();
    this.getOffice();
    this.getUser();
  }

  ngOnInit(): void {
    this.getEntry();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  getUser(filters = {}) {
    const sub = this.userService
      .getUsers({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[3].items = response.results.map((res) => ({ id: res.id, name: res.username }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getResouceSelf(filters = {}) {
    const sub = this.resouceselfService
      .getAftselfresources({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[5].items = response.results.map((res) => ({ id: res.id, name: res.nro_inventario }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getPatient(filters = {}) {
    const sub = this.patientService
      .getPatients({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[2].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getOffice(filters = {}) {
    const sub = this.officeService
      .getOffice({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[4].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }


  getEntry(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.entryService
      .getEntry(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.entry = response.results.map((res) => ({
            ...res,
            paciente_string: res.paciente.nombre,
            user_string: res.medico_solicitante.username,
            sala_string: res.sala.nombre,
            cama_string: res.cama.nro_inventario
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
    this.getEntry(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getEntry(filters, 'id', 'desc');
  }

  createEntry() {
    let dialogRef: MatDialogRef<EntryFormComponent, any>;

    dialogRef = this.dialog.open(EntryFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        entry: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as EntryFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((entry: Entry) =>
          this.entryService.createEntry(entry).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el Ingreso. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getEntry(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Ingreso fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<EntryFormComponent, any>;

    dialogRef = this.dialog.open(EntryFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        entry: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as EntryFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((entry: Entry) =>
          this.entryService.editEntry({ ...entry, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el Ingreso. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getEntry(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Ingreso fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteEntry(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Ingreso?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.entryService.deleteEntry(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Ingreso. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getEntry(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Ingreso fue eliminado correctamente.', 'Felicidades');
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
    this.getEntry(this.filters, sort.active, sort.direction);
  }
}
