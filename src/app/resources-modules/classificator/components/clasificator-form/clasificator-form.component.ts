import { ResourceTypeService } from './../../../type/services/type.service';
import { ResourceType } from './../../../type/models/type';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-clasificator-form',
  templateUrl: './clasificator-form.component.html',
  styleUrls: ['./clasificator-form.component.scss'],
})
export class ClasificatorFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  resourceTypes: ResourceType[];

  subscriptions: Subscription[] = [];

  clasificatorForm: FormGroup;

  constructor(
    private resourceTypeService: ResourceTypeService,
    public dialogRef: MatDialogRef<ClasificatorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getResourceTypes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  buildForm() {
    this.clasificatorForm = new FormGroup({
      id: new FormControl(this.data?.clasificator?.id ? this.data?.clasificator.id : null),
      nombre: new FormControl(this.data?.clasificator?.nombre ? this.data?.clasificator.nombre : null, [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'),
      ]),
      tipo: new FormControl(this.data?.clasificator?.tipo ? this.data?.clasificator.tipo.id : null, [Validators.required]),
      modelo: new FormControl(this.data?.clasificator?.modelo ? this.data?.clasificator.modelo : null, [Validators.required]),
      numero_serie: new FormControl(this.data?.clasificator?.numero_serie ? this.data?.clasificator.numero_serie : null, [Validators.required]),
      marca: new FormControl(this.data?.clasificator?.marca ? this.data?.clasificator.marca : null, [Validators.required]),
    });
  }

  get idControl() {
    return this.clasificatorForm.get('id') as FormControl;
  }

  get nombreControl() {
    return this.clasificatorForm.get('nombre') as FormControl;
  }

  get tipoControl() {
    return this.clasificatorForm.get('tipo') as FormControl;
  }

  get marcaControl() {
    return this.clasificatorForm.get('marca') as FormControl;
  }

  get modeloControl() {
    return this.clasificatorForm.get('modelo') as FormControl;
  }

  get numeroSerieControl() {
    return this.clasificatorForm.get('numero_serie') as FormControl;
  }

  onSubmit(data) {
    this.data.clasificator ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

  getResourceTypes() {
    const sub = this.resourceTypeService
      .getResourceTypes({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.resourceTypes = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
}
