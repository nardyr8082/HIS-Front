import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-provider-form',
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.scss'],
})
export class ProviderFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  providerForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<ProviderFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.providerForm = new FormGroup({
      id: new FormControl(this.data?.provider?.id ? this.data?.provider.id : null),
      nombre: new FormControl(this.data?.provider?.nombre ? this.data?.provider.nombre : null, [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'),
      ]),
      descripcion: new FormControl(this.data?.provider?.descripcion ? this.data?.provider.descripcion : null, [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'),
      ]),
      telefono: new FormControl(this.data?.provider?.telefono ? this.data?.provider.telefono : null, [
        Validators.required,
        Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+'),
      ]),
      correo: new FormControl(this.data?.provider?.correo ? this.data?.provider.correo : null, [Validators.required, Validators.email]),
      representante: new FormControl(this.data?.provider?.representante ? this.data?.provider.representante : null, [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'),
      ]),
    });
  }

  get idControl() {
    return this.providerForm.get('id') as FormControl;
  }

  get nombreControl() {
    return this.providerForm.get('nombre') as FormControl;
  }

  get descripcionControl() {
    return this.providerForm.get('descripcion') as FormControl;
  }

  get telefonoControl() {
    return this.providerForm.get('telefono') as FormControl;
  }

  get correoControl() {
    return this.providerForm.get('correo') as FormControl;
  }

  get representanteControl() {
    return this.providerForm.get('representante') as FormControl;
  }

  onSubmit(data) {
    this.data.provider ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
