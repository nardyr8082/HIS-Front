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
import { ClinicalSectionService } from 'src/app/clinical-services/treatment-indications/services/clinical-section.service';
import { Interview } from '../../models/interview.model';
import { InterviewService } from '../../services/interview.service';
@Component({
  selector: 'app-interview-form',
  templateUrl: './interview-form.component.html',
  styleUrls: ['./interview-form.component.scss']
})
export class InterviewFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  interviewForm: FormGroup;
  clinicalSection: any = [];
  subscriptions: Subscription[] = [];
  constructor(
    public interviewService: InterviewService,
    private clinicalSectionService: ClinicalSectionService,

    public dialogRef: MatDialogRef<InterviewFormComponent>,
    private toastrService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

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
    this.interviewForm = new FormGroup({
      descripcion: new FormControl(this.data.interview ? this.data.interview.descripcion : '', Validators.required),
      sesion_clinica: new FormControl(this.data.interview ? this.data.interview.id_sesion_clinica : '', Validators.required),

    });
  }

  get descripcionControl() {
    return this.interviewForm?.get('descripcion') as FormControl;
  }

  get sesion_clinicaControl() {
    return this.interviewForm?.get('sesion_clinica') as FormControl;
  }

  onSubmit(data) {
    this.data.interview ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

}
