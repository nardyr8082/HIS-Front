import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-gender-form',
  templateUrl: './gender-form.component.html',
  styleUrls: ['./gender-form.component.scss'],
})
export class GenderFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  genderForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<GenderFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.genderForm = new FormGroup({
      descripcion: new FormControl(this.data.gender ? this.data.gender.descripcion : '',[Validators.required ,Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]),
    });
  }

  get nameGenderControl() {
    return this.genderForm?.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.gender ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
