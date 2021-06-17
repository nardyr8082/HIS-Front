import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-municipality-form',
  templateUrl: './municipality-form.component.html',
  styleUrls: ['./municipality-form.component.scss'],
})
export class MunicipalityFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  municipalityForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<MunicipalityFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.municipalityForm = new FormGroup({
      nombre: new FormControl(this.data.municipality ? this.data.municipality.nombre : '', Validators.required),
    });
  }

  onSubmit(data) {
    this.data.municipality ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
