import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';

@Component({
  selector: 'app-frequency-type-form',
  templateUrl: './frequency-form.component.html',
  styleUrls: ['./frequency-form.component.scss'],
})
export class FrequencyFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  frequencyForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<FrequencyFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.frequencyForm = new FormGroup({
      id: new FormControl(this.data?.frequency?.id ? this.data?.frequency.id : null),
      descripcion: new FormControl(this.data?.frequency?.descripcion ? this.data?.frequency.descripcion : null, [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'),
      ]),
    });
  }

  get idControl() {
    return this.frequencyForm.get('id') as FormControl;
  }

  get descripcionControl() {
    return this.frequencyForm.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.frequency ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
