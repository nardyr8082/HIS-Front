import { ResourceTypeService } from './../../../type/services/type.service';
import { ResourceAttribute } from './../../../attribute/models/attribute.model';
import { ResourceType } from './../../../type/models/type';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResourceAttributeService } from 'src/app/resources-modules/attribute/services/attribute.service';
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
  resourceAttributes: ResourceAttribute[];

  subscriptions: Subscription[] = [];

  clasificatorForm: FormGroup;

  constructor(
    private resourceTypeService: ResourceTypeService,
    private resourceAttributeService: ResourceAttributeService,
    public dialogRef: MatDialogRef<ClasificatorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getResourceTypes();
    this.getResourceAttributes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  buildForm() {
    const attributes = this.data?.clasificator?.atributos ? this.data?.clasificator?.atributos.map((a) => a.id) : null;
    this.clasificatorForm = new FormGroup({
      id: new FormControl(this.data?.clasificator?.id ? this.data?.clasificator.id : null),
      nombre: new FormControl(this.data?.clasificator?.nombre ? this.data?.clasificator.nombre : null, [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'),
      ]),
      tipo: new FormControl(this.data?.clasificator?.tipo ? this.data?.clasificator.tipo.id : null, [Validators.required]),
      atributos: new FormControl(attributes, [Validators.required]),
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

  get atributosControl() {
    return this.clasificatorForm.get('atributos') as FormControl;
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

  getResourceAttributes() {
    const sub = this.resourceAttributeService
      .getAttributes({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.resourceAttributes = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
}
