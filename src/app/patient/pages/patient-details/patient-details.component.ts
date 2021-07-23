import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { PatientService } from '../../services/patient.service';
import { catchError, map } from 'rxjs/operators';
import * as moment from 'moment';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss'],
})
export class PatientDetailsComponent implements OnInit {
  patient: Patient;
  patientId: number;
  subscriptions: Subscription[] = [];
  apiUrl = environment.serverUrl;

  constructor(
    private activatedRoute: ActivatedRoute,
    private patientService: PatientService,
    private toastService: ToastrService,
    private _location: Location,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.patientId = params['id'];
    });
  }

  ngOnInit(): void {
    if (this.patientId) {
      this.getPatient(this.patientId);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  goBack() {
    this._location.back();
  }

  getItemsDescription(items: Array<any>) {
    let result = '';
    items.forEach((item) => {
      result = result.concat(`${item.descripcion}, `);
    });
    return result.slice(0, -2);
  }

  getPatient(patientId) {
    const sub = this.patientService
      .getPatientById(patientId)
      .pipe(
        map((response: any) => {
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
}
