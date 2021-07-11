import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-commercial-operation-form',
  templateUrl: './commercial-operation-form.component.html',
  styleUrls: ['./commercial-operation-form.component.scss'],
})
export class CommercialOperationFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  commercialOperationForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<CommercialOperationFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.commercialOperationForm = new FormGroup({
      descripcion: new FormControl(this.data.commercialOperation ? this.data.commercialOperation.descripcion : '',[Validators.required ,Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]),
    });
  }

  get nameCommercialOperationControl() {
    return this.commercialOperationForm?.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.commercialOperation ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
