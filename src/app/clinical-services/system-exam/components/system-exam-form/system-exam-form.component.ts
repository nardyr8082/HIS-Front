import { Component, ContentChild, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { SystemExamService } from '../../services/system-exam.service';
import { SystemExam } from '../../models/system-exam.model';
import { PhysicalexamService } from '../../../physicalexam/services/physicalexam.service'

@Component({
  selector: 'app-system-examn-form',
  templateUrl: './system-exam-form.component.html',
  styleUrls: ['./system-exam-form.component.scss'],
})
export class SystemExamFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  systemExamForm: FormGroup;
  fisicExam: any = [];
  fisic: any = [];
  system: any = [];
  subscriptions: Subscription[] = [];

  constructor(public systemExamService: SystemExamService, 
    private fisicExamService: PhysicalexamService,
    public dialogRef: MatDialogRef<SystemExamFormComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getFisicExam();
    this.getSystem();

  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getFisicExamEdit(id) {
    const sub = this.systemExamService
      .getPhysicalexam(id)
      .pipe(
        map((response) => {
          this.fisicExam = response.results; }),
      )
      .subscribe();

    this.subscriptions.push(sub);
    console.log(this.fisicExam);
  }

  getFisicExam() {
    const sub = this.systemExamService
      .getFisicExam()
      .pipe(
        map((response: ApiResponse<any>) => {
          if (this.data.systemExam) {
          this.getFisicExamEdit(this.data.systemExam.examen_fisico.id);
           }
          else{
            this.fisicExam = response.results;
          }
      
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getSystem() {
    const sub = this.systemExamService
      .getSystem()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.system = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    this.systemExamForm = new FormGroup({
      observacion: new FormControl(this.data.systemExam ? this.data.systemExam.observacion : '',[ Validators.required,  Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$') ]),
      examen_fisico: new FormControl(this.data.systemExam ? this.data.systemExam.examen_fisico_id : '', Validators.required),
      sistema: new FormControl(this.data.systemExam ? this.data.systemExam.sistema_id : '', Validators.required),
    });
  }

  get nameSystemExamControl() {
    return this.systemExamForm?.get('observacion') as FormControl;
  }

  get fisicExamControl() {
    return this.systemExamForm?.get('examen_fisico') as FormControl;
  }

  get systemControl() {
    return this.systemExamForm?.get('sistema') as FormControl;
  }

  onSubmit(data) {
    this.data.systemExam ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
