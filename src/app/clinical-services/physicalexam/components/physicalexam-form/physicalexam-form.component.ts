import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { PhysicalexamService } from '../../services/physicalexam.service';


@Component({
  selector: 'app-physicalexam-form',
  templateUrl: './physicalexam-form.component.html',
  styleUrls: ['./physicalexam-form.component.scss'],
})
export class PhysicalexamFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  physicalexamForm: FormGroup;
  sesion_clinica: any = [];
  subscriptions: Subscription[] = [];

  constructor(public physicalexamService: PhysicalexamService, public dialogRef: MatDialogRef<PhysicalexamFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getClinicSession();
  }

  ngOnDestroy() {
    this.subscriptions;
  }
  getClinicSession() {
    const sub = this.physicalexamService
      .getClinicSession()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.sesion_clinica = response.results;
          console.log(this.sesion_clinica);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  buildForm() {
    this.physicalexamForm = new FormGroup({
      ta: new FormControl(this.data.physicalexam ? this.data.physicalexam.ta: ''),
      fc: new FormControl(this.data.physicalexam ? this.data.physicalexam.fc: ''),
      temperatura: new FormControl(this.data.physicalexam ? this.data.physicalexam.temperatura: ''),
      peso: new FormControl(this.data.physicalexam ? this.data.physicalexam.peso: ''),
      altura: new FormControl(this.data.physicalexam ? this.data.physicalexam.altura: ''),
      imc: new FormControl(this.data.physicalexam ? this.data.physicalexam.imc: ''),
      impresion_general: new FormControl(this.data.physicalexam ? this.data.physicalexam.impresion_general: ''),
      constitucion: new FormControl(this.data.physicalexam ? this.data.physicalexam.constitucion: ''),
      actitud: new FormControl(this.data.physicalexam ? this.data.physicalexam.actitud: ''),
      decubito: new FormControl(this.data.physicalexam ? this.data.physicalexam.decubito: ''),
      marcha: new FormControl(this.data.physicalexam ? this.data.physicalexam.marcha: ''),
      observaciones_generales: new FormControl(this.data.physicalexam ? this.data.physicalexam.observaciones_generales: ''),
      sesion_clinica: new FormControl(this.data.physicalexam ? this.data.physicalexam.sesion_clinica.id : '', Validators.required),
    });
  }


  get sessionControl() {
    return this.physicalexamForm?.get('sesion_clinica') as FormControl;
  }
  onSubmit(data) {
    this.data.physicalexam ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
