import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ServicesstockService } from '../../services/servicesstock.service';
import { Office } from '../../../../structure-modules/office/models/office.model';
import { OfficeService } from '../../../../structure-modules/office/services/office.service';
import { User } from '../../../../security-module/user/models/user.model';
import { Tax } from '../../../classifiers/tax/models/tax.model';
import { UserService } from '../../../../security-module/user/services/user.service';
import { TaxService } from '../../../classifiers/tax/services/tax.service';
import { MyValidation } from '../../../boxstock/validator/validator';

@Component({
  selector: 'app-servicesstock-form',
  templateUrl: './servicesstock-form.component.html',
  styleUrls: ['./servicesstock-form.component.scss'],
})
export class ServicesstockFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  servicesstockForm: FormGroup;
  subscriptions: Subscription[] = [];

  departamento: Office[];
  usuario: User[];
  impuesto: Tax[];

  constructor(private departamentoService: OfficeService, private usuarioService: UserService, private impuestoService: TaxService, public dialogRef: MatDialogRef<ServicesstockFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.getOffice();
    this.getTax();
    this.getUser();
    this.buildForm();
  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getOffice() {
    const sub = this.departamentoService
      .getOffice({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<Office>) => {
          this.departamento = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getUser() {
    const sub = this.usuarioService
      .getUsers({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<User>) => {
          this.usuario = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getTax() {
    const sub = this.impuestoService
      .getTaxs({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response: ApiResponse<Tax>) => {
          this.impuesto = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    this.servicesstockForm = new FormGroup({
      id: new FormControl(this.data?.servicesstock?.id ? this.data?.servicesstock.id : null),
      codigo: new FormControl(this.data?.servicesstock?.codigo ? this.data?.servicesstock.codigo : null, Validators.required),
      nombre: new FormControl(this.data?.servicesstock?.nombre ? this.data?.servicesstock.nombre : null, Validators.required),
      precio: new FormControl(this.data?.servicesstock?.precio ? this.data?.servicesstock.precio : null, [Validators.required, MyValidation.isDecimal]),
      impuesto: new FormControl(this.data?.servicesstock?.impuesto ? this.data?.servicesstock.impuesto.id : null, Validators.required),
      usuario: new FormControl(this.data?.servicesstock?.usuario ? this.data?.servicesstock.usuario.id : null, Validators.required),
      departamento: new FormControl(this.data?.servicesstock?.departamento ? this.data?.servicesstock.departamento.id : null, Validators.required),
    });
  }
  get idControl() {
    return this.servicesstockForm.get('id') as FormControl;
  }

  get codecControl() {
    return this.servicesstockForm.get('codigo') as FormControl;
  }

  get nameControl() {
    return this.servicesstockForm.get('nombre') as FormControl;
  }

  get priceControl() {
    return this.servicesstockForm.get('precio') as FormControl;
  }
  get taxControl() {
    return this.servicesstockForm.get('impuesto') as FormControl;
  }
  get userControl() {
    return this.servicesstockForm.get('usuario') as FormControl;
  }
  get officeControl() {
    return this.servicesstockForm.get('departamento') as FormControl;
  }
  onSubmit(data) {
    this.data.servicesstock ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
