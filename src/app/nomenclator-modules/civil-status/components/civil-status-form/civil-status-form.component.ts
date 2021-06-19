import { Component, OnInit, Inject, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-civil-status-form',
  templateUrl: './civil-status-form.component.html',
  styleUrls: ['./civil-status-form.component.scss']
})
export class CivilStatusFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  civilStatusForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<CivilStatusFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.civilStatusForm = new FormGroup({
      descripcion: new FormControl(this.data.civilStatus ? this.data.civilStatus.descripcion : '', Validators.required),
    })
  }

  onSubmit(data) {
    this.data.civilStatus ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

}
