import { Component, ContentChild, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { VariableIndicatorService } from '../../services/variable-indicator.service';
import { VariableIndicator } from '../../models/variable-indicator.model';

@Component({
  selector: 'app-variable-indicator-form',
  templateUrl: './variable-indicator-form.component.html',
  styleUrls: ['./variable-indicator-form.component.scss'],
})
export class VariableIndicatorFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  varibleIndicatorForm: FormGroup;
  varibleIndicator: any = [];
  subscriptions: Subscription[] = [];

  constructor(public variableIndicatorService: VariableIndicatorService, public dialogRef: MatDialogRef<VariableIndicatorFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getIndicator();

  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getIndicator() {
    const sub = this.variableIndicatorService
      .getIndicator()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.varibleIndicator = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    this.varibleIndicatorForm = new FormGroup({
      nombre: new FormControl(this.data.variableIndicator ? this.data.variableIndicator.nombre : '',[ Validators.required,  Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$') ]),
      SQL: new FormControl(this.data.variableIndicator ? this.data.variableIndicator.SQL : '', Validators.required),
    });
  }

  get nameControl() {
    return this.varibleIndicatorForm?.get('nombre') as FormControl;
  }

  get sqlControl() {
    return this.varibleIndicatorForm?.get('SQL') as FormControl;
  }

  onSubmit(data) {
    this.data.variableIndicator ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
