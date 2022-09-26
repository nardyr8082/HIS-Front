import { ClinicHistoryStaticService } from '../services/clinic-history-static.service';
import { PatientService } from 'src/app/patient/services/patient.service';
import { CLINIC_HISTORY_STATIC_TABLE_CONFIGURATION } from '../models/clinic-history-static-table-configuration'
import { ClinicHistoryStatic } from '../models/clinic-history-static.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { ClinicHistoryStaticFormComponent } from '../clinic-history-static-form/clinic-history-static-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { ConfirmationDialogFrontComponent } from 'src/app/shared/confirmation-dialog-front/confirmation-dialog-front.component';
import { Sort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { ClinicHistoryStaticPinComponent } from './clinic-history-static-pin/clinic-history-static-pin/clinic-history-static-pin.component';
import { ClinicHistoryStaticPin } from './clinic-history-static-pin/models/clinic-history-static-pin.model';
import { Clinicsession } from '../../clinicsession/models/clinicsession.model';
import { ClinicsessionService } from '../../clinicsession/services/clinicsession.service';
import { Physicalexam } from '../../physicalexam/models/physicalexam.model';
import { PhysicalexamService } from '../../physicalexam/services/physicalexam.service';
@Component({
  selector: 'app-clinic-history-static-page',
  templateUrl: './clinic-history-static-page.component.html',
  styleUrls: ['./clinic-history-static-page.component.scss']
})
export class ClinicHistoryStaticPageComponent implements OnInit {
  clinicHistoryStatic: ClinicHistoryStatic[];
  dataCount = 0;
  configuration = CLINIC_HISTORY_STATIC_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;
  patient = [];
  clinicsession = [];
  physicalexam = [];



  rowActionButtons = [
    {
      tooltipText: 'Editar Historia Clínica',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.goToForm(item),
    }, {
      tooltipText: 'Detalles de Historia Clínica',
      icon: 'visibility',
      color: 'primary',
      class: 'btn-default',
      callback: (item) => this.goToDetails(item),
    }, {
      tooltipText: 'Adicionar Sección Clínica',
      icon: 'assignment',
      color: 'primary',
      class: 'btn-default',
      callback: (item) => this.goToClinicSeccion(item),
    },
    {
      tooltipText: 'Eliminar Historia Clínica',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteClinicHistoryStatic(item),
    },
  ];


  constructor(
    public dialog: MatDialog,
    private clinicHistoryStaticService: ClinicHistoryStaticService,
    private patientService: PatientService,
    private toastService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private clinicsessionService: ClinicsessionService,
    private physicalexamService: PhysicalexamService,

  ) {
    this.putPatient();

  }

  ngOnInit(): void {
    this.getSeccionClinic();
    this.getClinicHistoryStatic();

  }
  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  putPatient(filters = {}) {
    const sub = this.patientService
      .getPatients(filters, 'descripcion', 'asc', 1, 10000)

      .pipe(
        map((response) => {

          this.configuration.tableFilters[1].items = response.results.map((res) => ({ id: res.id, name: res.nro_identificacion }));
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }



  getSeccionClinic() {
    const sub = this.clinicsessionService
      .getClinicsession({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {

          this.clinicsession = response.results;

          this.clinicsession = response.results.map((res) => ({
            id_hc: res.hc.id,
            medico_realiza_string: res.medico_realiza.first_name,
            fecha_solicitud: res.fecha_realizacion,
            fecha_realizacion: res.fecha_realizacion
          }));
          console.log(this.clinicsession);
          console.log(this.clinicHistoryStatic);
          for (let i = 0; i < this.clinicsession.length; i++) {
            for (let j = 0; j < this.clinicHistoryStatic.length; j++) {
              const elementi = this.clinicsession[i];
              const elementj = this.clinicHistoryStatic[j];
              if (this.clinicsession[i].id_hc == this.clinicHistoryStatic[j].id) {
                this.clinicHistoryStatic[j].medico_realiza_string = (this.clinicsession[i].medico_realiza_string) ? this.clinicsession[i].medico_realiza_string : '';
                this.clinicHistoryStatic[j].fecha_solicitud = (this.clinicsession[i].fecha_solicitud) ? this.clinicsession[i].fecha_solicitud : '';
                this.clinicHistoryStatic[j].fecha_realizacion = (this.clinicsession[i].fecha_realizacion) ? this.clinicsession[i].fecha_realizacion : '';
              }

            }


          }
          console.log(this.clinicsession);
          console.log(this.clinicHistoryStatic);
        }),
        catchError(() => {
          this.toastService.error('Hubo un error obteniendo los datos del usuario.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);



  }

  getClinicHistoryStatic(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.clinicHistoryStaticService
      .getClinicHistoryStatic(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {

          this.clinicHistoryStatic = response.results.map((res) => {
            //const medico_realiza_string= 
            console.log(this.clinicsession)
            return {
              ...res,
              id: res.id,
              numero_hc: res.numero_hc,
              paciente: res.paciente.nro_identificacion,
              paciente_id: res.paciente.id,
              paciente_pin: (res.paciente.pin) ? res.paciente.pin : '0000',
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
  }





  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getClinicHistoryStatic(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getClinicHistoryStatic(filters, 'id', 'desc');
  }


  /*  createClinicHistoryStatic() {
     let dialogRef: MatDialogRef<ClinicHistoryStaticFormComponent, any>;
 
     dialogRef = this.dialog.open(ClinicHistoryStaticFormComponent, {
       panelClass: 'app-dialog-add-edit-business',
       maxWidth: '500px',
       minWidth: '150px',
       maxHeight: '100vh',
       width: '100%',
       data: {
 
         clinicHistoryStatic: null,
 
         patient: null,
 
       },
     });
 
     const modalComponentRef = dialogRef.componentInstance as ClinicHistoryStaticFormComponent;
 
     const sub = modalComponentRef.create
       .pipe(
 
 
         switchMap((ClinicHistoryStatic: ClinicHistoryStatic) =>
           this.clinicHistoryStaticService.createClinicHistoryStatic(ClinicHistoryStatic).pipe(
             catchError(() => {
               this.toastService.error('Hubo un error al crear la Historia Clínica . Por favor, inténtelo de nuevo más tarde.', 'Error');
 
               return of(null);
             }),
             tap((success) => {
               if (success) {
                 this.getClinicHistoryStatic(this.filters, 'id', 'desc', this.page, this.pageSize);
 
                 this.toastService.success('La Historia Clínica  fue creado correctamente.', 'Felicidades');
 
               }
             }),
           ),
         ),
       )
       .subscribe();
 
     this.subscriptions.push(sub);
   } */

  /*  openEditForm(item) {
 
     let dialogRef: MatDialogRef<ClinicHistoryStaticFormComponent, any>;
 
     dialogRef = this.dialog.open(ClinicHistoryStaticFormComponent, {
       panelClass: 'app-dialog-add-edit-business',
       maxWidth: '500px',
       minWidth: '150px',
       maxHeight: '100vh',
       width: '100%',
       data: {
         clinicHistoryStatic: item,
       },
     });
 
     const modalComponentRef = dialogRef.componentInstance as ClinicHistoryStaticFormComponent;
 
     const sub = modalComponentRef.edit
       .pipe(
 
         switchMap((ClinicHistoryStatic: ClinicHistoryStatic) =>
           this.clinicHistoryStaticService.editClinicHistoryStatic({ ...ClinicHistoryStatic, id: item.id }).pipe(
             catchError(() => {
               this.toastService.error('Hubo un error al editar la Historia clínica . Por favor, inténtelo de nuevo más tarde.', 'Error');
 
               return of(null);
             }),
             tap((success) => {
               if (success) {
                 this.getClinicHistoryStatic(this.filters, 'id', 'desc', this.page, this.pageSize);
 
                 this.toastService.success('La Historia Clínica fue modificado correctamente.', 'Felicidades');
 
               }
             }),
           ),
         ),
       )
       .subscribe();
 
     this.subscriptions.push(sub);
   } */

  goToForm(item = null) {
    item ? this.router.navigate(['edit', item.id], { relativeTo: this.route }) : this.router.navigate(['create'], { relativeTo: this.route });
  }


  goToDetails(clinicHistoryStatic?: ClinicHistoryStatic) {
    const pin_paciente = clinicHistoryStatic.paciente_pin;

    if (pin_paciente == '0000') {
      clinicHistoryStatic ? this.router.navigateByUrl(`/clinic-history-static/details/${clinicHistoryStatic.id}`) : this.router.navigateByUrl(`clinic-history-static`);
    }
    if (pin_paciente != '0000' && pin_paciente != '') {
      let dialogRef: MatDialogRef<ClinicHistoryStaticPinComponent, any>;
      dialogRef = this.dialog.open(ClinicHistoryStaticPinComponent, {
        panelClass: 'app-dialog-add-edit-business',
        maxWidth: '500px',
        minWidth: '150px',
        maxHeight: '100vh',
        width: '100%',
        data: {
          dataclinicHistoryStaticPin: clinicHistoryStatic,
        },
      });

      const modalComponentRef = dialogRef.componentInstance as ClinicHistoryStaticPinComponent;

      const sub = modalComponentRef.create
    }
    if (pin_paciente == '' || pin_paciente == null) {
      const modalRef = this.dialog.open(ConfirmationDialogFrontComponent, {
        data: {
          title: 'Pin Historia Clínica',
          question: 'Esta Historia clínica no tiene Pin. Debe crearlo',
        },
      });

      const modalComponentRef = modalRef.componentInstance as ConfirmationDialogFrontComponent;

    }







  }

  goToClinicSeccion(clinicHistoryStatic?: ClinicHistoryStatic) {
    console.log(clinicHistoryStatic);
    clinicHistoryStatic ? this.router.navigateByUrl(`/clinical-session`) : this.router.navigateByUrl(`clinic-history-static`);
  }

  deleteClinicHistoryStatic(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;

    modalComponentRef.text = `¿Está seguro que desea eliminar la Historia Clínica?`;


    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.clinicHistoryStaticService.deleteClinicHistoryStatic(item.id).pipe(
            map(() => item),
            catchError(() => {

              this.toastService.error('Hubo un error al eliminar la Historia Clínica . Por favor, inténtelo de nuevo más tarde.', 'Error');

              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getClinicHistoryStatic(this.filters, 'id', 'desc', this.page, this.pageSize);

                this.toastService.success('La Historia Clínica  fue eliminado correctamente.', 'Felicidades');

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

    this.getClinicHistoryStatic(this.filters, sort.active, sort.direction);
  }







}
