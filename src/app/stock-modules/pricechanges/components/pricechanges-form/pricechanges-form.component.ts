import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { PricechangesService } from '../../services/pricechanges.service';
import { ValidationPrinceChanges } from '../../validator/validator';


@Component({
  selector: 'app-pricechanges-form',
  templateUrl: './pricechanges-form.component.html',
  styleUrls: ['./pricechanges-form.component.scss'],
})
export class PricechangesFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  pricechangesForm: FormGroup;
  usuario: any = [];
  lote: any = [];
  subscriptions: Subscription[] = [];

  constructor(public pricechangesService: PricechangesService, public dialogRef: MatDialogRef<PricechangesFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getLote();
    this.getUser();

  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getUser() {
    const sub = this.pricechangesService
      .getUser()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.usuario = response.results;
          console.log(this.usuario);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getLote() {
    const sub = this.pricechangesService
      .getLote()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.lote = response.results;
          console.log(this.lote);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    const fecha = this.data.pricechanges ? this.getFormattedDate(this.data.pricechanges.fecha) : '';
    const hora = this.data.pricechanges ? this.getFormattedHora(this.data.pricechanges.fecha) : '';
    console.log('Inicial: ', this.data.pricechanges);
    this.pricechangesForm = new FormGroup({
      id: new FormControl(this.data?.pricechanges?.id ? this.data?.pricechanges.id : null),
      fechaT: new FormControl(fecha, Validators.required),
      hora: new FormControl(hora, Validators.required),
      precio_viejo: new FormControl(this.data.pricechanges ? this.data.pricechanges.precio_viejo : '', [Validators.required, ValidationPrinceChanges.isDecimalFijo172]),
      precio_nuevo: new FormControl(this.data.pricechanges ? this.data.pricechanges.precio_nuevo : '', [Validators.required, ValidationPrinceChanges.isDecimalFijo172]),
      comentario: new FormControl(this.data.pricechanges ? this.data.pricechanges.comentario : '', Validators.required),
      lote: new FormControl(this.data.pricechanges ? this.data.pricechanges.lote_id : '', Validators.required),
      usuario: new FormControl(this.data.pricechanges ? this.data.pricechanges.usuario_id : '', Validators.required),
    });
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
  getFormattedDate(apiDate: string) {
    const arrayDate = apiDate.split('-');
    return new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[2]));
  }
  getFormattedHora(apiDate: string) {
    if (apiDate.indexOf('Z') !== -1 )
     apiDate = apiDate.substring(0, apiDate.length - 1);
    return new Date(apiDate);
  }
  get dateControl() {
    return this.pricechangesForm?.get('fechaT') as FormControl;
  }
  get timeControl() {
    return this.pricechangesForm?.get('hora') as FormControl;
  }
  get oldpriceControl() {
    return this.pricechangesForm?.get('precio_viejo') as FormControl;
  }

  get newpriceControl() {
    return this.pricechangesForm?.get('precio_nuevo') as FormControl;
  }

  get comentaryControl() {
    return this.pricechangesForm?.get('comentario') as FormControl;
  }

  get loteControl() {
    return this.pricechangesForm?.get('lote') as FormControl;
  }
  get userControl() {
    return this.pricechangesForm?.get('usuario') as FormControl;
  }

  onSubmit(data) {
    let valores = {};
    //2021-07-31T10:46:00Z
    let fecha = data['fechaT'].toString();
    let hora = data['hora'].toString();
    console.log('mira mi hora', hora);
    let formateada = fecha.split(' ');
    let formateadahora = hora.split(' ');
    console.log('arregloa: ', formateadahora);
    if ( this.data.suplierreturn === null || formateada.length > 0) {
      const midate = formateada[3] + '-' + this.ChangesMonth(formateada[1]) + '-' + formateada[2];
      const mihora = 'T' + formateadahora[4];
      valores['fecha'] = midate + mihora;
      valores['precio_viejo'] = data['precio_viejo'];
      valores['precio_nuevo'] = data['precio_nuevo'];
      valores['comentario'] = data['comentario'];
      valores['lote'] = data['lote'];
      valores['usuario'] = data['usuario'];
    }
    console.log('valores: ', valores);
    this.data.pricechanges ? this.edit.emit(valores) : this.create.emit(valores);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
