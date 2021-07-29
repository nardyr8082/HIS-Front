import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { MatCheckboxChange } from '@angular/material/checkbox';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TreatmentIndications } from '../../models/treatment-indications.model';
import { TreatmentIndicationsService } from '../../services/treatment-indications.service';
import { ClinicalSectionService } from '../../services/clinical-section.service';
@Component({
  selector: 'app-treatment-indications-form',
  templateUrl: './treatment-indications-form.component.html',
  styleUrls: ['./treatment-indications-form.component.scss']
})
export class TreatmentIndicationsFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  treatmentIndications: TreatmentIndications[]
  treatmentIndicationsForm: FormGroup;
  clinicalSection: any = [];
  subscriptions: Subscription[] = [];

  constructor(public treatmentIndicationsService: TreatmentIndicationsService,
    private clinicalSectionService: ClinicalSectionService,
    public dialogRef: MatDialogRef<TreatmentIndicationsFormComponent>,
    private toastrService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.buildForm();
    this.getClinicalSection();
  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getClinicalSection() {
    const sub = this.clinicalSectionService
      .getClinicalSection({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.clinicalSection = response.results;

        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {

    const fecha = this.data.treatmentIndications ? this.getFormattedDate(this.data.treatmentIndications.fecha) : '';
    const hora = this.data.treatmentIndications ? this.getFormattedHora(this.data.treatmentIndications.fecha) : '';

    this.treatmentIndicationsForm = new FormGroup({
      descripcion: new FormControl(this.data.treatmentIndications ? this.data.treatmentIndications.descripcion : '', Validators.required),
      fecha: new FormControl(fecha, Validators.required),
      hora: new FormControl(hora, Validators.required),
      sesion_clinica: new FormControl(this.data.treatmentIndications ? this.data.treatmentIndications.id_sesion_clinica : '', Validators.required),


    });

  }

  get descripcionControl() {
    return this.treatmentIndicationsForm?.get('descripcion') as FormControl;
  }
  get timeControl() {
    return this.treatmentIndicationsForm?.get('hora') as FormControl;
  }

  get sesion_clinicaControl() {
    return this.treatmentIndicationsForm?.get('sesion_clinica') as FormControl;
  }

  getFormattedDate(apiDate: string) {
    const arrayDate = apiDate.split('-');
    return new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[2]));
  }
  getFormattedHora(apiDate: string) {
    if (apiDate.indexOf('Z') !== -1)
      apiDate = apiDate.substring(0, apiDate.length - 1);
    return new Date(apiDate);
  }

  sendData() {
    if (this.treatmentIndicationsForm.valid) {

      const treatmentIndications = this.treatmentIndicationsForm.value;
      const dateFormat = moment(treatmentIndications.fecha);
      treatmentIndications.fecha = dateFormat.format('yyyy-MM-DD');


      this.data.treatmentIndicationsForm ? this.edit.emit(treatmentIndications) : this.create.emit(treatmentIndications);
      this.dialogRef.close();
    } else {
      this.toastrService.error('Por favor revise los formularios, quedan campos requeridos sin llenar', 'Error');
    }
  }

  onSubmit(data) {

    let valores = {};
    let fecha = data['fecha'].toString();
    let hora = data['hora'].toString();
    let formateadaFecha = fecha.split(' ');
    let formateadaHora = hora.split(' ');


    if (this.data.treatmentIndicationsForm === null || formateadaFecha.length > 0) {
      const midateFecha = formateadaFecha[3] + '-' + this.ChangesMonth(formateadaFecha[1]) + '-' + formateadaFecha[2];
      //const mihora = 'T' + formateadaHora[4];
      const mihora = formateadaHora[4];
      data['fecha'] = midateFecha /* + mihora */;
      data['hora'] = mihora /* + mihora */;



      valores['descripcion'] = data['descripcion'];
      valores['hora'] = data['hora'];
      valores['fecha'] = data['fecha'];
      valores['sesion_clinica'] = data['sesion_clinica'];
    }


    this.data.treatmentIndications ? this.edit.emit(valores) : this.create.emit(valores);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

  ChangesMonth(mes: any) {

    if (mes === 'Jan') {
      return '01';
    }
    if (mes === 'Feb') {
      return '02';
    }
    if (mes === 'Mar') {
      return '03';
    }
    if (mes === 'Apr') {
      return '04';
    }
    if (mes === 'May') {
      return '05';
    }
    if (mes === 'Jun') {
      return '06';
    }
    if (mes === 'Jul') {
      return '07';
    }
    if (mes === 'Aug') {
      return '08';
    }
    if (mes === 'Sep') {
      return '09';
    }
    if (mes === 'Oct') {
      return '10';
    }
    if (mes === 'Nov') {
      return '11';
    }
    return 12;
  }
}
