import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cat-science-form',
  templateUrl: './cat-science-form.component.html',
  styleUrls: ['./cat-science-form.component.scss'],
})
export class CatScienceFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  catScienceForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<CatScienceFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    console.log(this.data);
  }

  buildForm() {
    this.catScienceForm = new FormGroup({
      descripcion: new FormControl(this.data.catScience ? this.data.catScience.descripcion : '', Validators.required),
    });
  }

  onSubmit(data) {
    this.data.catScience ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
