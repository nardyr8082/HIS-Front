import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { StateService } from '../../../state/services/state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-municipality-form',
  templateUrl: './municipality-form.component.html',
  styleUrls: ['./municipality-form.component.scss'],
})
export class MunicipalityFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  subscriptions: Subscription[] = [];
  municipalityForm: FormGroup;
  province: any[] = [];
  filteredOptions: Array<any>;

  constructor(private provinceService: StateService, public dialogRef: MatDialogRef<MunicipalityFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getProvince();
  }

  buildForm() {
    this.municipalityForm = new FormGroup({
      nombre: new FormControl(this.data.municipality ? this.data.municipality.nombre : '', Validators.required),
      estado: new FormControl(this.data.municipality ? this.data.municipality.province_id : '', Validators.required),
    });
  }

  getProvince() {
    const sub = this.provinceService
      .getStates(null, 'id', 'desc', 1, 10000)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.province = response.results;
          this.filteredOptions = this.province;
        }),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  onSubmit(data) {
    this.data.municipality ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscriptions;
  }
}
