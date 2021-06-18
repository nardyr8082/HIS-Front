import { Component, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cat-docent-form',
  templateUrl: './cat-docent-form.component.html',
  styleUrls: ['./cat-docent-form.component.scss']
})
export class CatDocentFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  
  catDocentForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<CatDocentFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.catDocentForm = new FormGroup({
      description: new FormControl(this.data.catDocent ? this.data.catDocent.description : '', Validators.required),
    })
  }

  onSubmit(data) {
    this.data.catDocent ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
