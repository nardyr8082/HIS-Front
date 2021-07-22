import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ServicesstockService } from '../../services/servicesstock.service';


@Component({
  selector: 'app-servicesstock-form',
  templateUrl: './servicesstock-form.component.html',
  styleUrls: ['./servicesstock-form.component.scss'],
})
export class ServicesstockFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  servicesstockForm: FormGroup;
  usuario: any = [];
  impuesto: any = [];
  departamento: any = [];
  subscriptions: Subscription[] = [];

  constructor(public servicesstockService: ServicesstockService, public dialogRef: MatDialogRef<ServicesstockFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getOffice();
    this.getImpuesto();
    this.getUser();

  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getUser() {
    const sub = this.servicesstockService
      .getUser()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.usuario = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getOffice() {
    const sub = this.servicesstockService
      .getOffice()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.departamento = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getImpuesto() {
    const sub = this.servicesstockService
      .getImpuesto()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.impuesto = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    this.servicesstockForm = new FormGroup({
      codigo: new FormControl(this.data.servicesstock ? this.data.servicesstock.codigo : '', Validators.required),
      nombre: new FormControl(this.data.servicesstock ? this.data.servicesstock.nombre : '', Validators.required),
      precio: new FormControl(this.data.servicesstock ? this.data.servicesstock.precio : '', Validators.required),
      impuesto: new FormControl(this.data.servicesstock ? this.data.servicesstock.impuesto_id : '', Validators.required),
      usuario: new FormControl(this.data.servicesstock ? this.data.servicesstock.usuario_id : '', Validators.required),
      departamento: new FormControl(this.data.servicesstock ? this.data.servicesstock.departamento_id : '', Validators.required),
    });
  }
  get codecControl() {
    return this.servicesstockForm?.get('codigo') as FormControl;
  }
  get nameControl() {
    return this.servicesstockForm?.get('nombre') as FormControl;
  }

  get priceControl() {
    return this.servicesstockForm?.get('precio') as FormControl;
  }

  get impuestoControl() {
    return this.servicesstockForm?.get('impuestp') as FormControl;
  }

  get userControl() {
    return this.servicesstockForm?.get('usuario') as FormControl;
  }
  get officeControl() {
    return this.servicesstockForm?.get('departamento') as FormControl;
  }

  onSubmit(data) {
    this.data.servicesstock ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
