import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { OfficeService } from '../../../../structure-modules/office/services/office.service';
import { StockService } from '../../services/stock.service';
import { Office } from '../../../../structure-modules/office/models/office.model';
import { UserService } from '../../../../security-module/user/services/user.service';
import { User } from '../../../../security-module/user/models/user.model';



@Component({
  selector: 'app-stock-form',
  templateUrl: './stock-form.component.html',
  styleUrls: ['./stock-form.component.scss'],
})
export class StockFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  office: Office[];
  user: User[];

  subscriptions: Subscription[] = [];

  stockForm: FormGroup;

  constructor(
    private getStockService: StockService,
    private getUserService: UserService,
    private officeService: OfficeService,
    public dialogRef: MatDialogRef<StockFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getOffice();
    this.getUser();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  buildForm() {
    this.stockForm = new FormGroup({
      id: new FormControl(this.data?.stock?.id ? this.data?.stock.id : null),
      codigo: new FormControl(this.data?.stock?.codigo ? this.data?.stock.codigo : null, Validators.required),
      nombre: new FormControl(this.data?.stock?.nombre ? this.data?.stock.nombre : null, Validators.required),
      direccion: new FormControl(this.data?.stock?.direccion ? this.data?.stock.direccion : null, Validators.required),
      activo: new FormControl(this.data?.stock?.activo ? this.data?.stock.activo : true),
      punto_de_venta: new FormControl(this.data?.stock?.punto_de_venta ? this.data?.punto_de_venta : true),
      jefe_almacen: new FormControl(this.data?.stock?.jefe_almacen ? this.data?.stock.jefe_almacen.id : null, Validators.required),
      departamento: new FormControl(this.data?.stock?.departamento ? this.data?.stock.departamento.id : null, Validators.required),
    });
  }

  get idControl() {
    return this.stockForm.get('id') as FormControl;
  }

  get codecControl() {
    return this.stockForm.get('codigo') as FormControl;
  }

  get nameControl() {
    return this.stockForm.get('nombre') as FormControl;
  }

  get addressControl() {
    return this.stockForm.get('direccion') as FormControl;
  }
  get bossstockControl() {
    return this.stockForm.get('jefe_almacen') as FormControl;
  }
  get officeControl() {
    return this.stockForm.get('departamento') as FormControl;
  }

  onSubmit(data) {
    this.data.stock? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

  getOffice() {
    const sub = this.officeService
      .getOffice({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.office = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getUser() {
    const sub = this.getUserService
      .getUsers({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.user = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
}
