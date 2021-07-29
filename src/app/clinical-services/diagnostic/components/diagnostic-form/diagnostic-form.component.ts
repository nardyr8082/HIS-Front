import { Component, ContentChild, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { DiagnosticService } from '../../services/diagnostic.service';
import { Diagnostic } from '../../models/diagnostic.model';

@Component({
  selector: 'app-diagnostic-form',
  templateUrl: './diagnostic-form.component.html',
  styleUrls: ['./diagnostic-form.component.scss'],
})
export class DiagnosticFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  diagnosticForm: FormGroup;
  clininc_session: any = [];
  subscriptions: Subscription[] = [];

  constructor(public diagnosticService: DiagnosticService, public dialogRef: MatDialogRef<DiagnosticFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getClinicSession();

  }

  ngOnDestroy() {
    this.subscriptions;
  }
  getClinicSession() {
    const sub = this.diagnosticService
      .getClinicSession()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.clininc_session = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    this.diagnosticForm = new FormGroup({
      descripcion: new FormControl(this.data.diagnostic ? this.data.diagnostic.descripcion : '',[ Validators.required,  Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$') ]),
      sesion_clinica: new FormControl(this.data.diagnostic ? this.data.diagnostic.sesion_clinica_id : '', Validators.required),
    });
  }

  get nameDiagnosticControl() {
    return this.diagnosticForm?.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.diagnostic ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
