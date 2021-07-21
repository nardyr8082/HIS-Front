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
    this.inventorysForm = new FormGroup({
      numero: new FormControl(this.data.inventorys ? this.data.inventorys.numero : '', Validators.required),
      fecha_inicio: new FormControl(this.data.inventorys ? this.data.inventorys.fecha_inicio : '', Validators.required),
      fecha_fin: new FormControl(this.data.inventorys ? this.data.inventorys.fecha_fin : '', Validators.required),
      usuario: new FormControl(this.data.inventorys ? this.data.inventorys.usuario_id : '', Validators.required),
      almacen: new FormControl(this.data.inventorys ? this.data.inventorys.almacen_id : '', Validators.required),
      estado: new FormControl(this.data.inventorys ? this.data.inventorys.estado_id : '', Validators.required),
    });
  }
  get numberControl() {
    return this.inventorysForm?.get('numero') as FormControl;
  }
  get datestartControl() {
    return this.inventorysForm?.get('fecha_inicio') as FormControl;
  }

  get dateendControl() {
    return this.inventorysForm?.get('fecha_fin') as FormControl;
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
    this.data.inventorys ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
