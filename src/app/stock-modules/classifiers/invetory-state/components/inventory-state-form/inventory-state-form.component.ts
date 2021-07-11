import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-inventory-state-form',
  templateUrl: './inventory-state-form.component.html',
  styleUrls: ['./inventory-state-form.component.scss'],
})
export class InventoryStateFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  inventoryStateForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<InventoryStateFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.inventoryStateForm = new FormGroup({
      descripcion: new FormControl(this.data.inventoryState ? this.data.inventoryState.descripcion : '', [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'),
      ]),
    });
  }

  get descripcionControl() {
    return this.inventoryStateForm?.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.inventoryState ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
