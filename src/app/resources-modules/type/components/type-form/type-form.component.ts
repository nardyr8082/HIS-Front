import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';

@Component({
  selector: 'app-type-form',
  templateUrl: './type-form.component.html',
  styleUrls: ['./type-form.component.scss'],
})
export class ResourceTypeFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  resourceTypeForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<ResourceTypeFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.resourceTypeForm = new FormGroup({
      id: new FormControl(this.data?.resourceType?.id ? this.data?.resourceType.id : null),
      descripcion: new FormControl(this.data?.resourceType?.descripcion ? this.data?.resourceType.descripcion : null, [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'),
      ]),
    });
  }

  get idControl() {
    return this.resourceTypeForm.get('id') as FormControl;
  }

  get descripcionControl() {
    return this.resourceTypeForm.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.resourceType ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
