import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-specialty-form',
  templateUrl: './specialty-form.component.html',
  styleUrls: ['./specialty-form.component.scss'],
})
export class SpecialtyFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  specialtyForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<SpecialtyFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.specialtyForm = new FormGroup({
      descripcion: new FormControl(this.data.specialty ? this.data.specialty.descripcion : '',[Validators.required ,Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]),
    });
  }

  get nameSpecialtyControl() {
    return this.specialtyForm?.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.specialty ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
