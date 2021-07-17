import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-almacencaja-form',
  templateUrl: './almacencaja-form.component.html',
  styleUrls: ['./almacencaja-form.component.scss'],
})
export class AlmacencajaFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  resourceTypes: ResourceType[];

  subscriptions: Subscription[] = [];

  almacencajaForm: FormGroup;

  constructor(
    private resourceTypeService: ResourceTypeService,
    public dialogRef: MatDialogRef<AlmacencajaFormComponent>,
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
    this.almacencajaForm = new FormGroup({
      id: new FormControl(this.data?.Almacencaja?.id ? this.data?.almacencaja.id : null),
      almacen: new FormControl(this.data?.almacencaja?.almacen ? this.data?.almacencaja.almacen.id : null, [Validators.required]),
      nro: new FormControl(this.data?.almacencaja?.modelo ? this.data?.almacencaja.modelo : null, [Validators.required]),
      cajero: new FormControl(this.data?.almacencaja?.cajero ? this.data?.almacencaja.cajero : null, [Validators.required]),
    });
  }

  get idControl() {
    return this.almacencajaForm.get('id') as FormControl;
  }

  get almacenControl() {
    return this.almacencajaForm.get('almacen') as FormControl;
  }

  get cajeroControl() {
    return this.almacencajaForm.get('cajero') as FormControl;
  }

  get numeroControl() {
    return this.almacencajaForm.get('nro') as FormControl;
  }

  onSubmit(data) {
    this.data.almacencaja? this.edit.emit(data) : this.create.emit(data);
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
