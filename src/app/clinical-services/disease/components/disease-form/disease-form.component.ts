import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';

@Component({
  selector: 'app-disease-form',
  templateUrl: './disease-form.component.html',
  styleUrls: ['./disease-form.component.scss'],
})
export class DiseaseFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  diseaseForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<DiseaseFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.diseaseForm = new FormGroup({
      id: new FormControl(this.data?.disease?.id ? this.data?.disease.id : null),
      nombre: new FormControl(this.data?.disease?.nombre ? this.data?.disease.nombre : null, [Validators.required]),
      descripcion: new FormControl(this.data?.disease?.descripcion ? this.data?.disease.descripcion : null, [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'),
      ]),
      codigo: new FormControl(this.data?.disease?.codigo ? this.data?.disease.codigo : null, [Validators.required]),
    });
  }

  get idControl() {
    return this.diseaseForm.get('id') as FormControl;
  }

  get descripcionControl() {
    return this.diseaseForm.get('descripcion') as FormControl;
  }

  get nombreControl() {
    return this.diseaseForm.get('nombre') as FormControl;
  }

  get codigoControl() {
    return this.diseaseForm.get('codigo') as FormControl;
  }

  onSubmit(data) {
    this.data.disease ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
