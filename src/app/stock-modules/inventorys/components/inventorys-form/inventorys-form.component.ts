import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { InventorysService } from '../../services/inventorys.service';

@Component({
  selector: 'app-inventorys-form',
  templateUrl: './inventorys-form.component.html',
  styleUrls: ['./inventorys-form.component.scss'],
})
export class InventorysFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  inventorysForm: FormGroup;
  usuario: any = [];
  almacen: any = [];
  estado: any = [];
  subscriptions: Subscription[] = [];

  constructor(public inventorysService: InventorysService, public dialogRef: MatDialogRef<InventorysFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getStock();
    this.getStatus();
    this.getUser();

  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getUser() {
    const sub = this.inventorysService
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
  getStatus() {
    const sub = this.inventorysService
      .getStatus()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.estado = response.results;
          console.log(this.estado);
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getStock() {
    const sub = this.inventorysService
      .getStock()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.almacen = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    const fechai = this.data.inventorys ? this.getFormattedDate(this.data.inventorys.fecha_inicio) : '';
    const horai = this.data.inventorys ? this.getFormattedHora(this.data.inventorys.fecha_inicio) : '';
    const fechaf = this.data.inventorys ? this.getFormattedDate(this.data.inventorys.fecha_fin) : '';
    const horaf = this.data.inventorys ? this.getFormattedHora(this.data.inventorys.fecha_fin) : '';
    console.log('mensaje data:', this.data.inventorys);
    console.log('fecha inicio:', fechai);
    console.log('hora inicio:', fechai);
    console.log('fecha fin', fechaf);
    console.log('hora fin:', horaf);
    this.inventorysForm = new FormGroup({
      numero: new FormControl(this.data.inventorys ? this.data.inventorys.numero : '', Validators.required),
      fecha_inicioT: new FormControl(fechai, Validators.required),
      horaiT: new FormControl(horai, Validators.required),
      horafT: new FormControl(horaf, Validators.required),
      fecha_finT: new FormControl(fechaf, Validators.required),
      usuario: new FormControl(this.data.inventorys ? this.data.inventorys.usuario_id : '', Validators.required),
      almacen: new FormControl(this.data.inventorys ? this.data.inventorys.almacen_id : '', Validators.required),
      estado: new FormControl(this.data.inventorys ? this.data.inventorys.estado_id : '', Validators.required),
    });
    console.log('mensaje form:', this.inventorysForm);
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
    console.log('getFormatDAte:', apiDate);
    const arrayDate = apiDate.split('-');
    return new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]) - 1, parseInt(arrayDate[2]));
  }
  getFormattedHora(apiDate: string) {
    //2021-07-09T13:48:00Z
    console.log('getFormatHora:', apiDate);
    console.log('mira la hora:', apiDate);
    const arrayDate = apiDate.split('T');
    let arrayDate1 = arrayDate[1];
    arrayDate1 = arrayDate1.substring(0, arrayDate1.length - 2);
    console.log('OJO: ', arrayDate1);
    const end = arrayDate1.split(':');
    console.log('OJO: ', end);
    return new Date(parseInt(end[0]), parseInt(end[1]) - 1, parseInt(end[2]));
  }
  get numberControl() {
    return this.inventorysForm?.get('numero') as FormControl;
  }
  get datestartControl() {
    return this.inventorysForm?.get('fecha_inicioT') as FormControl;
  }
  get timestartControl() {
    return this.inventorysForm?.get('horaiT') as FormControl;
  }
  get timeendControl() {
    return this.inventorysForm?.get('horafT') as FormControl;
  }

  get dateendControl() {
    return this.inventorysForm?.get('fecha_finT') as FormControl;
  }

  get stockControl() {
    return this.inventorysForm?.get('almacen') as FormControl;
  }

  get userControl() {
    return this.inventorysForm?.get('usuario') as FormControl;
  }
  get statusControl() {
    return this.inventorysForm?.get('estado') as FormControl;
  }

  onSubmit(data) {
    let valores = {};
    //2021-07-31T10:46:00Z
    let fecha = data['fecha_inicioT'].toString();
    let hora = data['horaiT'].toString();
    let fecha1 = data['fecha_finT'].toString();
    let hora1 = data['horafT'].toString();
    console.log('mira mi hora', hora);
    let formateada = fecha.split(' ');
    let formateadahora = hora.split(' ');
    let formateada1 = fecha1.split(' ');
    let formateadahora1 = hora1.split(' ');
    console.log('arregloa: ', formateadahora);
    if ( this.data.suplierreturn === null || formateada.length > 0) {
      const midate = formateada[3] + '-' + this.ChangesMonth(formateada[1]) + '-' + formateada[2];
      const midate1 = formateada1[3] + '-' + this.ChangesMonth(formateada1[1]) + '-' + formateada1[2];
      const mihora = 'T' + formateadahora[4] + 'Z';
      const mihora1 = 'T' + formateadahora1[4] + 'Z';
      valores['fecha_inicio'] = midate + mihora;
      valores['fecha_fin'] = midate1 + mihora1;
      valores['numero'] = data['numero'];
      valores['usuario'] = data['usuario'];
      valores['almacen'] = data['almacen'];
      valores['estado'] = data['estado'];
    }
    console.log('valores: ', valores);
    this.data.inventorys ? this.edit.emit(valores) : this.create.emit(valores);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
