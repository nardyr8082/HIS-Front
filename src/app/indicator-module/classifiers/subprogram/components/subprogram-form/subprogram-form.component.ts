import { Component, ContentChild, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../../../../core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { SubprogramService } from '../../services/subprogram.service';

@Component({
  selector: 'app-subprogram-form',
  templateUrl: './subprogram-form.component.html',
  styleUrls: ['./subprogram-form.component.scss'],
})
export class SubprogramFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  subprogramForm: FormGroup;
  programa: any = [];
  indicador: any = [];
  subscriptions: Subscription[] = [];

  constructor(public subprogramService: SubprogramService, public dialogRef: MatDialogRef<SubprogramFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getPrograma();
    this.getIndicador();

  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getPrograma() {
    const sub = this.subprogramService
      .getPrograma()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.programa = response.results;
          console.log(this.programa);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getIndicador() {
    const sub = this.subprogramService
      .getIndicador()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.indicador = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    const indicadoresIds = this.data.subprogram ? this.data.subprogram.indicador.map((r) => r.id) : [];
    this.subprogramForm = new FormGroup({
      descripcion: new FormControl(this.data.subprogram ? this.data.subprogram.descripcion : '', Validators.required),
      config: new FormControl(this.data.subprogram ? this.data.subprogram.config : '', Validators.required),
      indicador: new FormControl(indicadoresIds, Validators.required),
      programa: new FormControl(this.data.subprogram ? this.data.subprogram.programa_id : '', Validators.required),
    });
  }

  get descripcionControl() {
    return this.subprogramForm?.get('descripcion') as FormControl;
  }

  get configControl() {
    return this.subprogramForm?.get('config') as FormControl;
  }

  get indicadorControl() {
    return this.subprogramForm?.get('indicador') as FormControl;
  }

  get programaControl() {
    return this.subprogramForm?.get('programa') as FormControl;
  }

  onSubmit(data) {
    this.data.subprogram ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
