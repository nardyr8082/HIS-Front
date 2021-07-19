import { ResourceTypeService } from './../../../type/services/type.service';
import { ResourceType } from './../../../type/models/type';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResourceStatus } from '../../../status/models/resource-status.model';
import { Clasificator } from '../../../classificator/models/clasificator.model';
import { Office } from '../../../../structure-modules/office/models/office.model';
import { Patient } from '../../models/aftselfresources.model';
import { ResourceStatusService } from '../../../status/services/resource-status.service';
import { ClasificatorService } from '../../../classificator/services/clasificator.service';
import { OfficeService } from '../../../../structure-modules/office/services/office.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-aftselfresources-form',
  templateUrl: './aftselfresources-form.component.html',
  styleUrls: ['./aftselfresources-form.component.scss'],
})
export class AftselfresourcesFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  resourceTypes: ResourceType[];
  status: ResourceStatus[];
  clasificator: Clasificator[];
  office: Office[];
  patient: Patient[];

  subscriptions: Subscription[] = [];

  aftselfresourcesForm: FormGroup;

  constructor(
    private resourceTypeService: ResourceTypeService,
    private statusService: ResourceStatusService,
    private clasificatorService: ClasificatorService,
    private officeService: OfficeService,
    private patientService: PatientService,
    public dialogRef: MatDialogRef<AftselfresourcesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getResourceStatus();
    this.getClasificator();
    this.getOffice();
    this.getPatient();
    this.getResourceTypes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  buildForm() {
    this.aftselfresourcesForm = new FormGroup({
      id: new FormControl(this.data?.aftselfresources?.id ? this.data?.aftselfresources.id : null),
      nro_inventario: new FormControl(this.data?.aftselfresources?.nro_inventario ? this.data?.aftselfresources.nro_inventario : null, [
        Validators.required
      ]),
      activo: new FormControl(this.data?.aftselfresources?.activo ? this.data?.aftselfresources.activo : null),
      id_estado: new FormControl(this.data?.aftselfresources?.id_estado ? this.data?.aftselfresources.id_estado : null, [Validators.required]),
      id_recurso: new FormControl(this.data?.aftselfresources?.id_recurso ? this.data?.aftselfresources.id_recurso : null, [Validators.required]),
      id_departamento: new FormControl(this.data?.aftselfresources?.id_departamento ? this.data?.aftselfresources.id_departamento : null, [Validators.required]),
      paciente: new FormControl(this.data?.aftselfresources?.paciente ? this.data?.aftselfresources.paciente : null),
    });
  }

  get idControl() {
    return this.aftselfresourcesForm.get('id') as FormControl;
  }

  get inventoryNumberControl() {
    return this.aftselfresourcesForm.get('nro_inventario') as FormControl;
  }

  get activeControl() {
    return this.aftselfresourcesForm.get('activo') as FormControl;
  }

  get statusControl() {
    return this.aftselfresourcesForm.get('id_estado') as FormControl;
  }

  get clasificatorControl() {
    return this.aftselfresourcesForm.get('id_recurso') as FormControl;
  }

  get officeControl() {
    return this.aftselfresourcesForm.get('id_departamento') as FormControl;
  }

  get patientControl() {
    return this.aftselfresourcesForm.get('paciente') as FormControl;
  }

  onSubmit(data) {
    this.data.aftselfresources ? this.edit.emit(data) : this.create.emit(data);
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
  getResourceStatus() {
    const sub = this.statusService
      .getResourceStatuss({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.status = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getClasificator() {
    const sub = this.clasificatorService
      .getClasificators({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.clasificator = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getOffice() {
    const sub = this.officeService
      .getOffice({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.office = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
  getPatient() {
    const sub = this.patientService
      .getPatient({}, 'id', 'asc', 1, 10000)
      .pipe(
        map((response) => {
          this.patient = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }
}
