import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { PATIENT_TABLE_CONFIGURATION } from './../../models/patient-table-configuration';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from './../../services/patient.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Patient } from '../../models/patient.model';
import { of, Subscription } from 'rxjs';
import { DEFAULT_PAGE_SIZE, ApiResponse } from 'src/app/core/models/api-response.model';
import { Router } from '@angular/router';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-patient-page',
  templateUrl: './patient-page.component.html',
  styleUrls: ['./patient-page.component.scss'],
})
export class PatientPageComponent implements OnInit {
  patients: Patient[];
  dataCount = 0;
  configuration = PATIENT_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Detalles del Paciente',
      icon: 'visibility',
      color: 'primary',
      class: 'btn-default',
      callback: (item) => this.goToDetails(item),
    },
    {
      tooltipText: 'Editar Paciente',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.goToForm(item),
    },
    {
      tooltipText: 'Eliminar Paciente',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deletePatient(item),
    },
  ];

  constructor(private patientService: PatientService, private toastService: ToastrService, public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.getUsers();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getUsers(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.patientService
      .getPatients(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Patient>) => {
          this.patients = response.results;
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

  goToDetails(patient?: Patient) {
    patient ? this.router.navigateByUrl(`/patient/details/${patient.id}`) : this.router.navigateByUrl(`/patient/create`);
  }

  goToForm(patient?: Patient) {
    patient ? this.router.navigateByUrl(`/patient/edit/${patient.id}`) : this.router.navigateByUrl(`/patient/create`);
  }

  onChangeSort(sort: Sort) {
    this.getUsers(this.filters, sort.active, sort.direction);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getUsers(filters, 'id', 'desc');
  }

  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getUsers(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  deletePatient(item: Patient) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el Paciente: ${item.nombre} ${item.apellidos}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.patientService.deletePatient(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el Paciente. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getUsers(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El Paciente fue eliminado correctamente.', 'Felicidades');
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
}
