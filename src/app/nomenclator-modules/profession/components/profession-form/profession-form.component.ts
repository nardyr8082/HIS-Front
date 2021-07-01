import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-profession-form',
  templateUrl: './profession-form.component.html',
  styleUrls: ['./profession-form.component.scss'],
})
export class ProfessionFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  professionForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<ProfessionFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.professionForm = new FormGroup({
      nombre: new FormControl(this.data.profession ? this.data.profession.nombre : '',[Validators.required ,Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]),
    });
  }

  get nameProfessionControl() {
    return this.professionForm?.get('nombre') as FormControl;
  }

  onSubmit(data) {
    this.data.profession ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
