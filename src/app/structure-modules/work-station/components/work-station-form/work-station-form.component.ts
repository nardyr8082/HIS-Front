import { WorkStationService } from '../../services/office.service';
import { Subscription } from 'rxjs';
import { Component, EventEmitter, OnInit, Output, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleService } from 'src/app/security-module/role/services/role.service';
import { map } from 'rxjs/operators';
import { Role } from 'src/app/security-module/role/models/role.model';
import { ApiResponse } from 'src/app/core/models/api-response.model';

@Component({
  selector: 'app-work-station-form',
  templateUrl: './work-station-form.component.html',
  styleUrls: ['./work-station-form.component.scss'],
})
export class WorkStationFormComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  workStationForm: FormGroup;
  departaments: any[];
  roles: Role[];
  subscriptions: Subscription[] = [];

  constructor(
    public workStationService: WorkStationService,
    public dialogRef: MatDialogRef<WorkStationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.getDepartaments();
    this.getRoles();
    this.buildForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getDepartaments() {
    const sub = this.workStationService
      .getDepartaments()
      .pipe(
        map((response) => {
          this.departaments = response.results;
        }),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  getRoles() {
    const sub = this.workStationService
      .getRole(this.data.workStation ? this.data.workStation.rol?.id : null)
      .pipe(
        map((response: ApiResponse<Role>) => {
          this.roles = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    this.workStationForm = new FormGroup({
      rol: new FormControl(this.data.workStation ? this.data.workStation.rol?.id : '', Validators.required),
      departamento: new FormControl(this.data.workStation ? this.data.workStation.departamento?.id : '', Validators.required),
      descripcion: new FormControl(this.data.workStation ? this.data.workStation.descripcion : '', Validators.required),
    });
  }

  onSubmit(data) {
    this.data.workStation ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
