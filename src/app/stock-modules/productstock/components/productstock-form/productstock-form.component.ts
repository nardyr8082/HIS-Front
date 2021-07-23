import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductstockService } from '../../services/productstock.service';
import { MeasureService } from '../../../classifiers/measure/services/measure.service';
import { Measure } from '../../../classifiers/measure/models/measure.model';
import { ProductFamily } from '../../../classifiers/product-family/models/product-family.model';
import { TaxService } from '../../../classifiers/tax/services/tax.service';
import { ProgramService } from '../../../classifiers/program/services/program.service';
import { Tax } from '../../../classifiers/tax/models/tax.model';
import { Program } from '../../../classifiers/program/models/program.model';
import { ProductFamilyService } from '../../../classifiers/product-family/services/product-family.service';
import { Attribute } from '../../../classifiers/attribute/models/attribute.model';
import { AttributeService } from '../../../classifiers/attribute/services/attribute.service';




@Component({
  selector: 'app-productstock-form',
  templateUrl: './productstock-form.component.html',
  styleUrls: ['./productstock-form.component.scss'],
})
export class ProductstockFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  measure: Measure[];
  family: ProductFamily[];
  tax: Tax[];
  program: Program[];
  attribute: Attribute[];
  subscriptions: Subscription[] = [];

  productstockForm: FormGroup;

  constructor(
    private getMeasureService: MeasureService,
    private getattributeService: AttributeService,
    private getFamilyService: ProductFamilyService,
    private getTaxService: TaxService,
    private getProgramService: ProgramService,
    private productstockService: ProductstockService,
    public dialogRef: MatDialogRef<ProductstockFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getMeasure();
    this.getFamily();
    this.getTax();
    this.getProgram();
    this.getAttribute();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  buildForm() {
    const productIds = this.data.productstock ? this.data.productstock.atributos.map((r) => r.id) : [];
    this.productstockForm = new FormGroup({
      id: new FormControl(this.data?.productstock?.id ? this.data?.productstock.id : null),
      descripcion: new FormControl(this.data?.productstock?.descripcion ? this.data?.productstock.descripcion : null, Validators.required),
      codigo: new FormControl(this.data?.productstock?.codigo ? this.data?.productstock.codigo : null, Validators.required),
      activo: new FormControl(this.data.productstock ? this.data.productstock.activo : false),
      unidad_medida: new FormControl(this.data?.productstock?.unidad_medida ? this.data?.productstock.unidad_medida.id : null, Validators.required),
      familia: new FormControl(this.data?.productstock?.unidad_medida ? this.data?.productstock.familia.id : null, Validators.required),
      impuesto: new FormControl(this.data?.productstock?.impuesto ? this.data?.productstock.impuesto.id : null, Validators.required),
      programa: new FormControl(this.data?.productstock?.programa ? this.data?.productstock.programa.id : null, Validators.required),
      atributos: new FormControl(productIds, Validators.required),
    });
  }

  get idControl() {
    return this.productstockForm.get('id') as FormControl;
  }
  get attributeControl() {
    return this.productstockForm.get('atributos') as FormControl;
  }
  get measureControl() {
    return this.productstockForm.get('unidad_medida') as FormControl;
  }
  get codecControl() {
    return this.productstockForm.get('codigo') as FormControl;
  }

  get descriptionControl() {
    return this.productstockForm.get('descripcion') as FormControl;
  }

  get familyControl() {
    return this.productstockForm.get('familia') as FormControl;
  }

  get taxControl() {
    return this.productstockForm.get('impuesto') as FormControl;
  }
  get programControl() {
    return this.productstockForm.get('programa') as FormControl;
  }
  onSubmit(data) {
    this.data.productstock ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

  getMeasure() {
    const sub = this.getMeasureService
      .getMeasures({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.measure = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getFamily() {
    const sub = this.getFamilyService
      .getProductFamily(null, {}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.family = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getTax() {
    const sub = this.getTaxService
      .getTaxs({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.tax = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getAttribute() {
    const sub = this.getattributeService
      .getAttributes({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.attribute = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getProgram() {
    const sub = this.getProgramService
      .getPrograms({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.program = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
}
