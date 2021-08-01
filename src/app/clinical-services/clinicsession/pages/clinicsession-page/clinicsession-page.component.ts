import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from '../../../../core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';
import { Clinicsession } from '../../models/clinicsession.model';
import { ClinicsessionFormComponent } from '../../components/clinicsession-form/clinicsession-form.component';
import { Clinicsession_TABLE_CONFIGURATION } from '../../models/clinicsession-table-configuration';
import { ClinicsessionService } from '../../services/clinicsession.service';
import { UserService } from '../../../../security-module/user/services/user.service';
import { ClinicHistoryStaticService } from '../../../clinic-history-static/services/clinic-history-static.service';
import { DiseaseService } from '../../../disease/services/disease.service';
import { OfficeService } from '../../../../structure-modules/office/services/office.service';
import { Measure } from '../../../../stock-modules/classifiers/measure/models/measure.model';
import { ClinicHistoryStatic } from '../../../clinic-history-static/models/clinic-history-static.model';
import { User } from '../../../../security-module/user/models/user.model';
import { Office } from '../../../../structure-modules/office/models/office.model';



@Component({
  selector: 'app-clinicsession-page',
  templateUrl: './clinicsession-page.component.html',
  styleUrls: ['./clinicsession-page.component.scss'],
})
export class ClinicsessionPageComponent implements OnInit, OnDestroy {
  clinicsession: Clinicsession[];
  dataCount = 0;
  configuration = Clinicsession_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Sesión Clínica',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Sesión Clínica',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteClinicsession(item),
    },
  ];

  constructor(
    private clinicsessionService: ClinicsessionService,
    private userService: UserService,
    private clinicHistoryStaticService: ClinicHistoryStaticService,
    private diseaseService: DiseaseService,
    private officeService: OfficeService,
    private toastService: ToastrService,
    public dialog: MatDialog,
  ) {
    this.getCita();
    this.getUser1();
    this.getUser2();
    this.getDepartamento();
    this.getEnfermedades();
    this.getHc();
  }

  ngOnInit(): void {
    this.getClinicsession();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  getUser1(filters = {}) {
    const sub = this.userService
      .getUsers({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[4].items = response.results.map((res) => ({ id: res.id, name: res.username }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getUser2(filters = {}) {
    const sub = this.userService
      .getUsers({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[5].items = response.results.map((res) => ({ id: res.id, name: res.username }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getCita(filters = {}) {
    const sub = this.clinicsessionService
      .getCita()
      .pipe(
        map((response) => {
          this.configuration.tableFilters[6].items = response.results.map((res) => ({ id: res.id, name: res.numero }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getHc(filters = {}) {
    const sub = this.clinicHistoryStaticService
      .getClinicHistoryStatic({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[3].items = response.results.map((res) => ({ id: res.id, name: res.numero_hc }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getEnfermedades(filters = {}) {
    const sub = this.diseaseService
      .getDiseases({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[8].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getDepartamento(filters = {}) {
    const sub = this.officeService
      .getOffice({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.configuration.tableFilters[7].items = response.results.map((res) => ({ id: res.id, name: res.nombre }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  /*getClinicsession(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.clinicsessionService
      .getClinicsession(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.clinicsession = response.results.map((res) => ({
          const hcString = this.getHcString(res.hc);
          const userString = this.getMedicReaString(res.medico_solicita);
          const citaString = this.getMedicSolString(res.medico_realiza);
          const departementoString = this.getOfficeString(res.departamento);
          const enfermedadesString = this.getDiseaseString(res.enfermedades);
          return {
            ...res,
            medico_solicita_string: userString,
            medico_realiza_string: userString,
            cita_string: citaString,
            departamento_string: departementoString,
            enfermedades_string: enfermedadesString,
            hc_string: hcString,
          };
        });
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
  }*/

  getClinicsession(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.clinicsessionService
      .getClinicsession(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.clinicsession = response.results.map((res) => {
            //console.log('Hay datos: ', res);
            /*const measureString = this.getProductsmeasureString(res.unidad_medida);
            const familyString = this.getFamilyString(res.familia);
            const taxString = this.getTaxString(res.impuesto);
            const programString = this.getProgramString(res.programa);
            const attributeString = this.getAttributeString(res.atributos);
            const activo = res.activo ? '<p class="text-success">Si</p>' : '<p class="text-danger">No</p>';
            return { ...res, activo_string: activo, unidad_medida_string: measureString, familia_string: familyString, impuesto_string: taxString, programa_string: programString, atributos_string: attributeString };
            */
            const hcString = this.getHcString(res.hc);
            const userString = this.getMedicReaString(res.medico_solicita);
            const citaString = this.getMedicSolString(res.medico_realiza);
            const departementoString = this.getOfficeString(res.departamento);
            const enfermedadesString = this.getDiseaseString(res.enfermedades);
            return {
              ...res,
              medico_solicita_string: userString,
              medico_realiza_string: userString,
              cita_string: citaString,
              departamento_string: departementoString,
              enfermedades_string: enfermedadesString,
              hc_string: hcString };
          });
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
  getHcString(hc: ClinicHistoryStatic) {
    return hc.numero_hc;
  }
  getOfficeString(o: Office) {
    return o.nombre;
  }
  getMedicReaString(u: User) {
    return u.username;
  }
  getMedicSolString(u: User) {
    return u.username;
  }
  getDiseaseString(attribute: any) {
    let attribute_string = '';
    attribute.forEach((off) => {
      attribute_string = attribute_string.concat(`${off.nombre}, `);
    });
    return attribute_string.substring(0, attribute_string.length - 2);
  }

  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getClinicsession(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getClinicsession(filters, 'id', 'desc');
  }

  createClinicsession() {
    let dialogRef: MatDialogRef<ClinicsessionFormComponent, any>;

    dialogRef = this.dialog.open(ClinicsessionFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        clinicsession: null,
      },
      disableClose: true,
    });

    const modalComponentRef = dialogRef.componentInstance as ClinicsessionFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((clinicsession: Clinicsession) =>
          this.clinicsessionService.createClinicsession(clinicsession).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la Sesión Clínica. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getClinicsession(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Sesión Clínica fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<ClinicsessionFormComponent, any>;

    dialogRef = this.dialog.open(ClinicsessionFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        clinicsession: item,
      },
      disableClose: true,
    });
    const modalComponentRef = dialogRef.componentInstance as ClinicsessionFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((clinicsession: Clinicsession) =>
          this.clinicsessionService.editClinicsession({ ...clinicsession, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la Sesión Clínica. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getClinicsession(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Sesión Clínica fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteClinicsession(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar la Sesión Clínica?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.clinicsessionService.deleteClinicsession(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la Sesión Clínica. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getClinicsession(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Sesión Clínica fue eliminado correctamente.', 'Felicidades');
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
    this.getClinicsession(this.filters, sort.active, sort.direction);
  }
}
