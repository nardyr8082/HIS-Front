import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-blood-type-form',
  templateUrl: './blood-type-form.component.html',
  styleUrls: ['./blood-type-form.component.scss'],
})
export class BloodTypeFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  bloodTypeForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<BloodTypeFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.bloodTypeForm = new FormGroup({
      descripcion: new FormControl(this.data.bloodType ? this.data.bloodType.descripcion : ''),
    });
  }

  get nameBloodTypeControl() {
    return this.bloodTypeForm?.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.bloodType ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
