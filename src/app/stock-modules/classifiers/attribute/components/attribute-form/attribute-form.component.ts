import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-attribute-form',
  templateUrl: './attribute-form.component.html',
  styleUrls: ['./attribute-form.component.scss'],
})
export class AttributeFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  attributeForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AttributeFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.attributeForm = new FormGroup({
      id: new FormControl(this.data?.attribute?.id ? this.data?.attribute.id : null),
      descripcion: new FormControl(this.data?.attribute?.descripcion ? this.data?.attribute.descripcion : null, [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'),
      ]),
    });
  }

  get idControl() {
    return this.attributeForm.get('id') as FormControl;
  }

  get descripcionControl() {
    return this.attributeForm.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.attribute ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
