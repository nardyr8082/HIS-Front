import { DocTypeIdService } from './../../../nomenclator-modules/doc-type-id/services/doc-type-id.service';
import { BloodType } from './../../../nomenclator-modules/blood-type/models/blood-type.model';
import { Gender } from 'src/app/nomenclator-modules/gender/models/gender.model';
import { BloodTypeService } from './../../../nomenclator-modules/blood-type/services/blood-type.service';
import { GenderService } from 'src/app/nomenclator-modules/gender/services/gender.service';
import { NationalityService } from './../../../nomenclator-modules/nationality/services/nationality.service';
import { MunicipalityService } from './../../../nomenclator-modules/municipality/services/municipality.service';
import { Municipality } from 'src/app/nomenclator-modules/municipality/models/municipality.model';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { RaceService } from './../../../nomenclator-modules/race/services/race-service.service';
import { CivilStatusService } from './../../../nomenclator-modules/civil-status/services/civil-status.service';
import { Race } from './../../../nomenclator-modules/race/models/race.model';
import { CivilStatus } from './../../../nomenclator-modules/civil-status/models/civil-status.model';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from './../../services/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Patient } from '../../models/patient.model';
import { of, Subscription, Observable, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-patient-item',
  templateUrl: './patient-item.component.html',
  styleUrls: ['./patient-item.component.scss'],
})
export class PatientItemComponent implements OnInit {
  patient: Patient;
  patientId;

  civilStatus: CivilStatus[];
  races: Race[];
  nationalities: any[];
  municipalities: Municipality[];
  genders: Gender[];
  bloodTypes: BloodType[];
  docTypes: any[];

  subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private patientService: PatientService,
    private toastService: ToastrService,
    private civilStatusService: CivilStatusService,
    private racesService: RaceService,
    private municipalityService: MunicipalityService,
    private nationalityService: NationalityService,
    private genderService: GenderService,
    private bloodTypeService: BloodTypeService,
    private docTypeIdService: DocTypeIdService,
    private router: Router,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.patientId = params['id'];
    });
  }

  ngOnInit(): void {
    if (this.patientId) {
      this.getPatient(this.patientId);
    }

    this.getCivilStatus();
    this.getRaces();
    this.getNationalities();
    this.getBloodTypes();
    this.getMunicipalities();
    this.getGenders();
    this.getDocTypeIds();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getDocTypeIds() {
    const sub = this.docTypeIdService
      .getDocTypeId({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.docTypes = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los tipos de documentos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getGenders() {
    const sub = this.genderService
      .getGenders({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<Gender>) => {
          this.genders = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los sexos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getBloodTypes() {
    const sub = this.bloodTypeService
      .getBloodType({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<BloodType>) => {
          this.bloodTypes = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los grupos sanguíneos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getMunicipalities() {
    const sub = this.municipalityService
      .getMunicipalities({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<Municipality>) => {
          this.municipalities = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los municipios. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getNationalities() {
    const sub = this.nationalityService
      .getNationalities({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.nationalities = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener las Nacionalidades. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getCivilStatus() {
    const sub = this.civilStatusService
      .getCivilStatus({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<CivilStatus>) => {
          this.civilStatus = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los Estados civiles. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getRaces() {
    const sub = this.racesService
      .getRace({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<Race>) => {
          this.races = response.results;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los sexos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getPatient(patientId) {
    const sub = this.patientService
      .getPatientById(patientId)
      .pipe(
        map((response: Patient) => {
          this.patient = response;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener el paciente. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  onCreate(item) {
    this.createPatient(item);
  }

  editPatient(patient) {
    patient.id = this.patient.id;
    return this.patientService.editPatient(patient).pipe(
      catchError(() => {
        this.toastService.error('Hubo un error editando el paciente. Por favor, inténtelo de nuevo más tarde.');
        return of(null);
      }),
    );
    //   .subscribe();

    // this.subscriptions.push(sub);
  }

  createPatient(item) {
    const { foto, ...patient } = item;
    const sub = this.patientService
      .createPatient(patient)
      .pipe(
        map((response) => {
          if (foto) {
            const formData = new FormData();
            formData.append('id', response.id.toString());
            formData.append('foto', foto);
            const sub = this.patientService
              .uploadImagePatient(formData, response.id)
              .pipe(
                map(() => {
                  this.toastService.success('El paciente fue creado satisfactoriamente', 'Felicidades');
                  this.router.navigateByUrl('/patient');
                }),
              )
              .subscribe();

            this.subscriptions.push(sub);
          } else {
            this.toastService.success('El paciente fue creado satisfactoriamente', 'Felicidades');
            this.router.navigateByUrl('/patient');
          }
        }),
        catchError(() => {
          this.toastService.error('Hubo un error creando el paciente. Por favor, inténtelo de nuevo más tarde.');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  onEdit(item) {
    const editPatient: Observable<any> = this.editPatient(item);
    const observables: Observable<any>[] = [editPatient];

    if (item.foto) {
      const formData = new FormData();
      formData.append('id', item.id);
      formData.append('foto', item.foto);
      const uploadImageObservable = this.patientService.uploadImagePatient(formData, item.id);
      observables.push(uploadImageObservable);
    }

    forkJoin(observables)
      .pipe(
        map((response) => {
          this.toastService.success('El paciente ha sido editado correctamente.', 'Felicidades');
          this.router.navigateByUrl('/patient');
          return response;
        }),
        catchError((error) => {
          this.toastService.error('Hubo un error editando el final del paciente. Por favor, inténtelo de nuevo más tarde.');
          return of(error);
        }),
      )
      .subscribe();
  }
}
