import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-nationality-form',
  templateUrl: './nationality-form.component.html',
  styleUrls: ['./nationality-form.component.scss'],
})
export class NationalityFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  nationalityForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<NationalityFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.nationalityForm = new FormGroup({
      descripcion: new FormControl(this.data.nationality ? this.data.nationality.descripcion : '',[Validators.required ,Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]),
    });
  }

  get nameNationalityControl() {
    return this.nationalityForm?.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.nationality ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
