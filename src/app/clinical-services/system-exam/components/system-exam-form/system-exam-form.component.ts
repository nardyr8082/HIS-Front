import { Component, ContentChild, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { SystemExamService } from '../../services/system-exam.service';
import { SystemExam } from '../../models/system-exam.model';

@Component({
  selector: 'app-subcategory-form',
  templateUrl: './subcategory-form.component.html',
  styleUrls: ['./subcategory-form.component.scss'],
})
export class SystemExamFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  subcategoryForm: FormGroup;
  category: any = [];
  subscriptions: Subscription[] = [];

  constructor(public subcategoryService: SystemExamService, public dialogRef: MatDialogRef<SystemExamFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.buildForm();
    this.getCategory();

  }

  ngOnDestroy() {
    this.subscriptions;
  }
  getCategory() {
    const sub = this.subcategoryService
      .getCategory()
      .pipe(
        map((response: ApiResponse<any>) => {
          this.category = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    this.subcategoryForm = new FormGroup({
      descripcion: new FormControl(this.data.subcategory ? this.data.subcategory.descripcion : '',[ Validators.required,  Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$') ]),
      categoria: new FormControl(this.data.subcategory ? this.data.subcategory.categoria_id : '', Validators.required),
    });
  }

  get nameSystemExamControl() {
    return this.subcategoryForm?.get('descripcion') as FormControl;
  }

  onSubmit(data) {
    this.data.subcategory ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
