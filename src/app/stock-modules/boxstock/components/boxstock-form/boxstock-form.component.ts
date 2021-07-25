import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stock } from '../../models/boxstock.model';
import { StockService } from '../../services/stock.service';
import { MyValidation } from '../../validator/validator';
import { BoxstockService } from '../../services/boxstock.service';


@Component({
  selector: 'app-boxstock-form',
  templateUrl: './boxstock-form.component.html',
  styleUrls: ['./boxstock-form.component.scss'],
})
export class BoxstockFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  stock: Stock[];

  subscriptions: Subscription[] = [];

  boxstockForm: FormGroup;

  constructor(
    private getStockService: StockService,
    private boxstockService: BoxstockService,
    public dialogRef: MatDialogRef<BoxstockFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getStock();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  buildForm() {
    this.boxstockForm = new FormGroup({
      id: new FormControl(this.data?.boxstock?.id ? this.data?.boxstock.id : null),
      almacen: new FormControl(this.data?.boxstock?.almacen ? this.data?.boxstock.almacen.id : null, [Validators.required]),
      nro: new FormControl(this.data?.boxstock?.nro ? this.data?.boxstock.nro : null, [Validators.required, (Validators.maxLength(18))], MyValidation.validateFieldNumber(this.boxstockService, this.data?.boxstock?.id)),
      cajero: new FormControl(this.data?.boxstock?.cajero ? this.data?.boxstock.cajero : null, [Validators.required, (Validators.maxLength(20)), (Validators.min(1)), MyValidation.isNumberInt]),
    });
  }

  get idControl() {
    return this.boxstockForm.get('id') as FormControl;
  }

  get stockControl() {
    return this.boxstockForm.get('almacen') as FormControl;
  }

  get cashierControl() {
    return this.boxstockForm.get('cajero') as FormControl;
  }

  get numberControl() {
    return this.boxstockForm.get('nro') as FormControl;
  }

  onSubmit(data) {
    this.data.boxstock? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
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
}
