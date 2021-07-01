import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-doc-tyoe-id-form',
  templateUrl: './doc-type-id-form.component.html',
  styleUrls: ['./doc-type-id-form.component.scss'],
})
export class DocTypeIdFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  docTypeIdForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<DocTypeIdFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.docTypeIdForm = new FormGroup({
      descripcion: new FormControl(this.data.docTypeId ? this.data.docTypeId.descripcion : '',[Validators.required ,Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]),
    });
  }

  get nameDocTypeControl() {
    return this.docTypeIdForm?.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.docTypeId ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
