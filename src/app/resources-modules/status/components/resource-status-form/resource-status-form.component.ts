import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';

@Component({
  selector: 'app-resource-status-form',
  templateUrl: './resource-status-form.component.html',
  styleUrls: ['./resource-status-form.component.scss'],
})
export class ResourceStatusFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  resourceStatusForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<ResourceStatusFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.resourceStatusForm = new FormGroup({
      id: new FormControl(this.data?.resourceStatus?.id ? this.data?.resourceStatus.id : null),
      descripcion: new FormControl(this.data?.resourceStatus?.descripcion ? this.data?.resourceStatus.descripcion : null, [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'),
      ]),
    });
  }

  get idControl() {
    return this.resourceStatusForm.get('id') as FormControl;
  }

  get descripcionControl() {
    return this.resourceStatusForm.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.resourceStatus ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
