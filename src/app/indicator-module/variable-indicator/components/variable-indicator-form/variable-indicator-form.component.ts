import { Component, ContentChild, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { VariableIndicatorService } from '../../services/variable-indicator.service';
import { Indicator } from 'src/app/indicator-module/indicator/models/indicator.model';

@Component({
  selector: 'app-variable-indicator-form',
  templateUrl: './variable-indicator-form.component.html',
  styleUrls: ['./variable-indicator-form.component.scss'],
})
export class VariableIndicatorFormComponent implements OnInit, OnDestroy {
  indicatores$: Observable<Indicator[]>;
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  variableIndicatorForm: FormGroup;
  indicator: any = [];
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
          this.indicator = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    this.variableIndicatorForm = new FormGroup({
      nombre: new FormControl(this.data.variableIndicator ? this.data.variableIndicator.nombre : '',[ Validators.required,  Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$') ]),
      SQL: new FormControl(this.data.variableIndicator ? this.data.variableIndicator.SQL : '', Validators.required),
      indicador: new FormControl(this.data.variableIndicator ? this.data.variableIndicator.indicador_id : '', Validators.required),
    });
  }

  get nameControl() {
    return this.variableIndicatorForm?.get('nombre') as FormControl;
  }

  get sqlControl() {
    return this.variableIndicatorForm?.get('SQL') as FormControl;
  }

  get indicatorControl() {
    return this.variableIndicatorForm?.get('indicador') as FormControl;
  }

  onSubmit(data) {
    this.data.variableIndicator ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
