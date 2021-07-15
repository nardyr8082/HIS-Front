import { Component, ContentChild, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { ProductFamilyService } from '../../services/product-family.service';
import { ProductFamily } from '../../models/product-family.model';

@Component({
  selector: 'app-product-family-form',
  templateUrl: './product-family-form.component.html',
  styleUrls: ['./product-family-form.component.scss'],
})
export class ProductFamilyFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  productFamilyForm: FormGroup;
  productFamilyList: any = [];
  subscriptions: Subscription[] = [];

  constructor(public productFamilyService: ProductFamilyService, public dialogRef: MatDialogRef<ProductFamilyFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.data.productFamily ? this.getOtherProductFamily(this.data.productFamily.id) : this.getProductFamily();
    this.buildForm();
  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getOtherProductFamily(exclude: number) {
    const sub = this.productFamilyService
      .getProductFamily(exclude, null, 'id', 'desc', 1, 1000)
      .pipe(
        map((response: ApiResponse<ProductFamily>) => {
          this.productFamilyList = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getProductFamily() {
    const sub = this.productFamilyService
      .getProductFamily(null, null, 'id', 'desc', 1, 1000)
      .pipe(
        map((response: ApiResponse<ProductFamily>) => {
          this.productFamilyList = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    this.productFamilyForm = new FormGroup({
      codigo: new FormControl(this.data.productFamily ? this.data.productFamily.codigo : '', [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]),
      descripcion: new FormControl(this.data.productFamily ? this.data.productFamily.descripcion : '', [Validators.required]),
      padre: new FormControl(this.data.productFamily ? this.data.productFamily.padre_id : ''),
    });
  }

  get codeControl() {
    return this.productFamilyForm?.get('codigo') as FormControl;
  }

  get descripControl() {
    return this.productFamilyForm?.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.productFamily ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
