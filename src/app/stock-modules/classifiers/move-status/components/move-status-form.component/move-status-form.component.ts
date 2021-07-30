import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-move-status-form',
  templateUrl: './move-status-form.component.html',
  styleUrls: ['./move-status-form.component.scss'],
})
export class MoveStatusFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  moveStatusForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<MoveStatusFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.moveStatusForm = new FormGroup({
      descripcion: new FormControl(this.data.moveStatus ? this.data.moveStatus.descripcion : '', [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'),
      ]),
    });
  }

  get descripcionControl() {
    return this.moveStatusForm?.get('descripcion') as FormControl;
  }

 /*  onSubmit(data) {
    this.data.moveStatus ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  } */
}
