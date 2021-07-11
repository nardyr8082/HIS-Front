import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-inventory-status-form',
  templateUrl: './inventory-status-form.component.html',
  styleUrls: ['./inventory-status-form.component.scss'],
})
export class InventoryStatusFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  inventoryStatusForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<InventoryStatusFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.inventoryStatusForm = new FormGroup({
      descripcion: new FormControl(this.data.inventoryStatus ? this.data.inventoryStatus.descripcion : '',[Validators.required ,Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]),
    });
  }

  get nameInventoryStatusControl() {
    return this.inventoryStatusForm?.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.inventoryStatus ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
