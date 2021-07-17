import { Component, ContentChild, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { IndicatorService } from '../../services/indicator.service';
import { Indicator } from '../../models/indicator.model';

@Component({
  selector: 'app-indicator-form',
  templateUrl: './indicator-form.component.html',
  styleUrls: ['./indicator-form.component.scss'],
})
export class IndicatorFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  indicatorForm: FormGroup;
  indicator: any = [];
  subcategory : any = [];
  indicatorType : any = [];
  frequency : any = [];
  subscriptions: Subscription[] = [];

  constructor(public indicatorService: IndicatorService, public dialogRef: MatDialogRef<IndicatorFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getSubcategory();
    this.getIndicatorTypes();
    this.getFrequency();
  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getSubcategory() {
    const sub = this.indicatorService
      .getSubcategory()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.subcategory = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getIndicatorTypes() {
    const sub = this.indicatorService
      .getIndicatorTypes()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.indicatorType = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getFrequency() {
    const sub = this.indicatorService
      .getFrequency()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.frequency = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    this.indicatorForm = new FormGroup({
      nombre: new FormControl(this.data.indicator ? this.data.ndicator.nombre : '',[ Validators.required,  Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$') ]),
      especificidad: new FormControl(this.data.indicator ? this.data.indicator.especificidad : '', Validators.required),
      variables: new FormControl(this.data.indicator ? this.data.indicator.variables : '', Validators.required),
      objetivo: new FormControl(this.data.indicator ? this.data.indicator.objetivo : '', Validators.required),
      formula_de_calculo: new FormControl(this.data.indicator ? this.data.indicator.formula_de_calculo : '', Validators.required),
      interpretacion: new FormControl(this.data.indicator ? this.data.indicator.interpretacion : '', Validators.required),
      desglose_especifico: new FormControl(this.data.indicator ? this.data.indicator.desglose_especifico : '', Validators.required),
      metodo_medicion: new FormControl(this.data.indicator ? this.data.indicator.metodo_medicion : '', Validators.required),
      fuente_indicador: new FormControl(this.data.indicator ? this.data.indicator.fuente_indicador : '', Validators.required),
      subcategoria: new FormControl(this.data.indicator ? this.data.indicator.subcategoria_id : '', Validators.required),
      tipo_indicador: new FormControl(this.data.indicator ? this.data.indicator.tipo_indicador_id : '', Validators.required),
      frecuencia: new FormControl(this.data.indicator ? this.data.indicator.frecuencia_id : '', Validators.required),
    });
  }

  get nameControl() {
    return this.indicatorForm?.get('nombre') as FormControl;
  }

  onSubmit(data) {
    this.data.indicator ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
