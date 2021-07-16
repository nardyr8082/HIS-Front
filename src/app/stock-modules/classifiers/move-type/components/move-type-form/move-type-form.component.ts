import { ProductCategory } from './../../../product-category/models/product-category.model';
import { ProductCategoryService } from './../../../product-category/services/product-category.service';
import { CategoryService } from './../../../../../indicator-module/classifiers/category/services/category.service';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-move-type-form',
  templateUrl: './move-type-form.component.html',
  styleUrls: ['./move-type-form.component.scss'],
})
export class MoveTypeFormComponent implements OnInit {
  categories$: Observable<ProductCategory[]>;

  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  moveTypeForm: FormGroup;

  constructor(
    private productCategoryService: ProductCategoryService,
    public dialogRef: MatDialogRef<MoveTypeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.buildForm();
  }

  getCategories() {
    this.categories$ = this.productCategoryService.getProductCategorys({}, 'id', 'asc', 1, 10000).pipe(map((response: any) => response.results));
  }

  buildForm() {
    this.moveTypeForm = new FormGroup({
      id: new FormControl(this.data.moveType ? this.data.moveType.id : null),
      descripcion: new FormControl(this.data.moveType ? this.data.moveType.descripcion : null, [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'),
      ]),
      factor_diferencial: new FormControl(this.data.moveType ? this.data.moveType.factor_diferencial : null, [
        Validators.required,
        Validators.pattern('^[0-9]+([,][0-9]+)?$'),
      ]),
      categoria: new FormControl(this.data.moveType ? this.data.moveType.categoria.id : null, [Validators.required]),
    });
  }

  get descripcionControl() {
    return this.moveTypeForm?.get('descripcion') as FormControl;
  }

  get factor_diferencialControl() {
    return this.moveTypeForm?.get('factor_diferencial') as FormControl;
  }

  get categoriaControl() {
    return this.moveTypeForm?.get('categoria') as FormControl;
  }

  onSubmit(data) {
    this.data.moveType ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
