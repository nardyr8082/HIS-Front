import { ToastrService } from 'ngx-toastr';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { ClinicHistoryStaticService } from '../../../services/clinic-history-static.service';
import { of, Subscription } from 'rxjs';
import * as moment from 'moment';
import { Role } from 'src/app/security-module/role/models/role.model';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-clinic-history-details',
  templateUrl: './clinic-history-details.component.html',
  styleUrls: ['./clinic-history-details.component.scss']
})
export class ClinicHistoryDetailsComponent implements OnInit {
  clinicHistoryStatic: any;
  paciente: any;
  clinicHistoryStaticId: number;
  subscriptions: Subscription[] = [];

  apiUrl = environment.serverUrl;

  constructor(
    private clinicHistoryStaticService: ClinicHistoryStaticService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastrService,
    private _location: Location
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.clinicHistoryStaticId = params['id'];
    });
  }

  ngOnInit(): void {
    if (this.clinicHistoryStaticId) {
      this.getClinicHistoryStatic(this.clinicHistoryStaticId);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  goBack() {
    this._location.back();
  }



  getClinicHistoryStatic(clinicHistoryStaticId) {
    const sub = this.clinicHistoryStaticService
      .getClinicHistoryStaticById(clinicHistoryStaticId)
      .pipe(
        map((response: any) => {
          this.clinicHistoryStatic = response;
          this.paciente = response.paciente;
          moment.locale('es');



        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener la historia clínica. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return of(null);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

}
