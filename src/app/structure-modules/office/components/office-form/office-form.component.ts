import { Component, ContentChild, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import {OfficeService} from '../../services/office.service';
import {Office} from '../../models/office.model';

@Component({
  selector: 'app-office-form',
  templateUrl: './office-form.component.html',
  styleUrls: ['./office-form.component.scss'],
})
export class OfficeFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  officeForm: FormGroup;
  healthUList: any = [];
  subscriptions: Subscription[] = [];

  constructor(public officeService: OfficeService, public dialogRef: MatDialogRef<OfficeFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.getHealthUnits();
    this.buildForm();
  }

  ngOnDestroy() {
    this.subscriptions;
  }
  getHealthUnits() {
    const sub = this.officeService
      .getHealthUnit()
      .pipe(
        map((response: ApiResponse<Office>) => {
          console.log(response);
          this.healthUList = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    console.log(this.data);
    this.officeForm = new FormGroup({
      nombre: new FormControl(this.data.office ? this.data.office.nombre : '', Validators.required),
      unidad: new FormControl(this.data.office ? this.data.office.unidad_id : '', Validators.required),
    });
  }

  onSubmit(data) {
    this.data.office ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
