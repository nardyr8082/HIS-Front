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
    this.pricechangesForm = new FormGroup({
      fecha: new FormControl(this.data.pricechanges ? this.data.pricechanges.fecha : '', Validators.required),
      precio_viejo: new FormControl(this.data.pricechanges ? this.data.pricechanges.precio_viejo : '', [Validators.required, ValidationPrinceChanges.isDecimalFijo172]),
      precio_nuevo: new FormControl(this.data.pricechanges ? this.data.pricechanges.precio_nuevo : '', [Validators.required, ValidationPrinceChanges.isDecimalFijo172]),
      comentario: new FormControl(this.data.pricechanges ? this.data.pricechanges.comentario : ''),
      lote: new FormControl(this.data.pricechanges ? this.data.pricechanges.lote_id : '', Validators.required),
      usuario: new FormControl(this.data.pricechanges ? this.data.pricechanges.usuario_id : '', Validators.required),
    });
  }
  get dateControl() {
    return this.pricechangesForm?.get('fecha') as FormControl;
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
    this.data.pricechanges ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
