import { Component, ContentChild, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { OrgLevelService } from '../../services/org-level.service';
import { OrgLevel } from '../../models/org-level.model';

@Component({
  selector: 'app-org-level-form',
  templateUrl: './org-level-form.component.html',
  styleUrls: ['./org-level-form.component.scss'],
})
export class OrgLevelFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  orgLevelForm: FormGroup;
  orgLevelList: any = [];
  subscriptions: Subscription[] = [];

  constructor(public orgLevelService: OrgLevelService, public dialogRef: MatDialogRef<OrgLevelFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.data.orgLevel ? this.getOtherOrgLevel(this.data.orgLevel.id) : this.getOrgLevel();
    this.buildForm();
  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getOtherOrgLevel(exclude: number) {
    const sub = this.orgLevelService
      .getOrgLevel(exclude, null, 'id', 'desc', 1, 1000)
      .pipe(
        map((response: ApiResponse<OrgLevel>) => {
          this.orgLevelList = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getOrgLevel() {
    const sub = this.orgLevelService
      .getOrgLevel(null, null, 'id', 'desc', 1, 1000)
      .pipe(
        map((response: ApiResponse<OrgLevel>) => {
          this.orgLevelList = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    this.orgLevelForm = new FormGroup({
      nombre: new FormControl(this.data.orgLevel ? this.data.orgLevel.nombre : '', [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+$')]),
      nivel_padre: new FormControl(this.data.orgLevel ? this.data.orgLevel.nivel_padre_id : ''),
    });
  }

  get nameControl() {
    return this.orgLevelForm?.get('nombre') as FormControl;
  }

  onSubmit(data) {
    this.data.orgLevel ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
