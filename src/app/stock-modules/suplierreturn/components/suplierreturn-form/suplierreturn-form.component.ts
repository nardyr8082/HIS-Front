import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuplierreturnService } from '../../services/suplierreturn.service';
import { Stock } from '../../../stock/models/stock.model';
import { StockService } from '../../../stock/services/stock.service';
import { Provider } from '../../../classifiers/provider/models/provider.model';
import { User } from '../../../../security-module/user/models/user.model';
import { MoveStatus } from '../../../classifiers/move-status/models/move-status.model';
import { MoveType } from '../../../classifiers/move-type/models/move-type.model';
import { ProviderService } from '../../../classifiers/provider/services/provider.service';
import { MoveStatusService } from '../../../classifiers/move-status/services/move-status.service';
import { MoveTypeService } from '../../../classifiers/move-type/services/moveType.service';
import { UserService } from '../../../../security-module/user/services/user.service';
import { ValidationSuplierReturn } from '../../validator/validator';



@Component({
  selector: 'app-suplierreturn-form',
  templateUrl: './suplierreturn-form.component.html',
  styleUrls: ['./suplierreturn-form.component.scss'],
})
export class SuplierreturnFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  stock: Stock[];
  provider: Provider[];
  user: User[];
  movestatus: MoveStatus[];
  movetype: MoveType[];
  subscriptions: Subscription[] = [];

  suplierreturnForm: FormGroup;

  constructor(
    private getSuplierService: SuplierreturnService,
    private getProviderService: ProviderService,
    private getUserService: UserService,
    private getMoveSatusService: MoveStatusService,
    private getMoveTypeService: MoveTypeService,
    private getStockService: StockService,
    public dialogRef: MatDialogRef<SuplierreturnFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    const duda = 'Fri Jul 02 2021 00:00:00 GMT-0500 (GMT-05:00)';
    console.log('mi duda 1:', typeof(duda));
    const arr = duda.split(' ');
    console.log('ver ahora: ', arr);
    console.log('mi duda 2:', typeof(arr));
    this.buildForm();
    this.getStock();
    this.getUser();
    this.getStatus();
    this.getProvider();
    this.getMoveType();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  buildForm() {
    this.suplierreturnForm = new FormGroup({
      id: new FormControl(this.data?.suplierreturn?.id ? this.data?.suplierreturn.id : null),
      fecha: new FormControl(this.data?.suplierreturn?.fecha ? this.data?.suplierreturn.fecha : null, Validators.required),
      numero: new FormControl(this.data?.suplierreturn?.numero ? this.data?.suplierreturn.numero : null, [Validators.required, Validators.min(-2147483647), Validators.max(2147483647), ValidationSuplierReturn.esNumero]),
      comentario: new FormControl(this.data?.suplierreturn?.comentario ? this.data?.suplierreturn.comentario : null, Validators.required),
      nro_control: new FormControl(this.data?.suplierreturn?.nro_control ? this.data?.suplierreturn.nro_control : null, Validators.required),
      almacen: new FormControl(this.data?.suplierreturn?.almacen ? this.data?.suplierreturn.almacen.id : null, Validators.required),
      estado: new FormControl(this.data?.suplierreturn?.estado ? this.data?.suplierreturn.estado.id : null, Validators.required),
      tipo_de_movimiento: new FormControl(this.data?.suplierreturn?.tipo_de_movimiento ? this.data?.suplierreturn.tipo_de_movimiento.id : null, Validators.required),
      usuario: new FormControl(this.data?.suplierreturn?.usuario ? this.data?.suplierreturn.usuario.id : null, Validators.required),
      proveedor: new FormControl(this.data?.suplierreturn?.proveedor ? this.data?.suplierreturn.proveedor.id : null, Validators.required),
    });
  }

  get idControl() {
    return this.suplierreturnForm.get('id') as FormControl;
  }

  get dateControl() {
    return this.suplierreturnForm.get('fecha') as FormControl;
  }
  get userControl() {
    return this.suplierreturnForm.get('usuario') as FormControl;
  }
  get providerControl() {
    return this.suplierreturnForm.get('proveedor') as FormControl;
  }
  get movestypeControl() {
    return this.suplierreturnForm.get('tipo_de_movimiento') as FormControl;
  }
  get movestatusControl() {
    return this.suplierreturnForm.get('estado') as FormControl;
  }
  get stockControl() {
    return this.suplierreturnForm.get('almacen') as FormControl;
  }
  get controlnumberControl() {
    return this.suplierreturnForm.get('nro_control') as FormControl;
  }
  get numberControl() {
    return this.suplierreturnForm.get('numero') as FormControl;
  }

  get comentaryControl() {
    return this.suplierreturnForm.get('comentario') as FormControl;
  }

  onSubmit(data) {
    console.log('mi data es OK:', data);
    let fecha = data['fecha'].toString();
    let formateada = fecha.split(' ');
    console.log('mi data es  fecha:', formateada);
    //["Sat0", "Jul 1", "03 2", "2021 3", "00:00:00", "GMT-0500", "(GMT-05:00)"]
     const midate = formateada[3] + '-' + this.ChangesMonth(formateada[1]) + '-' + formateada[2];
    //data['fecha'] = '1991-04-07';
    console.log('el que yo cree: ', midate);
    if (midate === data['fecha']){
      console.log('HURRRA!!!!!');
    }
    this.data.suplierreturn ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }
   ChangesMonth(mes: any) {
    console.log('El mes es: ', mes);
    if (mes === 'Jan') {
      return '01';
    }
     if (mes === 'Feb') {
       return '02';
     }
     if (mes === 'Mar') {
       return '03';
     }
     if (mes === 'Apr') {
       return '04';
     }
     if (mes === 'May') {
       return '05';
     }
     if (mes === 'Jun') {
       return '06';
     }
     if (mes === 'Jul') {
       return '07';
     }
     if (mes === 'Aug') {
       return '08';
     }
     if (mes === 'Sep') {
       return '09';
     }
     if (mes === 'Oct') {
       return '10';
     }
     if (mes === 'Nov') {
       return '11';
     }
     return 12;
   }

  onCancel() {
    this.dialogRef.close();
  }

  getStock() {
    const sub = this.getStockService
      .getStock({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.stock = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getStatus() {
    const sub = this.getMoveSatusService
      .getMoveStatus({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.movestatus = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getMoveType() {
    const sub = this.getMoveTypeService
      .getMoveTypes({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.movetype = response.results;
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
  getProvider() {
    const sub = this.getProviderService
      .getProviders({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.provider = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
}
