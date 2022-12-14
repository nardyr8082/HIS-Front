import { PermissionService } from './../../services/permissions.service';
import { Component, ContentChild, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/core/models/api-response.model';
import { Permission } from '../../models/role.model';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';

@Component({
  selector: 'app-rol-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
})
export class RoleFormComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  roleForm: FormGroup;
  subscriptions: Subscription[] = [];

  permissions: Permission[];

  constructor(private permissionService: PermissionService, public dialogRef: MatDialogRef<RoleFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.getPermissions();
    this.buildForm();
  }

  ngOnDestroy() {
    this.subscriptions;
  }

  getPermissions() {
    const sub = this.permissionService
      .getAllPermissions()
      .pipe(
        map((response: ApiResponse<Permission>) => {
          this.permissions = response.results;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  buildForm() {
    const rolesIds = this.data.role ? this.data.role.permissions.map((r) => r.id) : [];
    this.roleForm = new FormGroup({
      name: new FormControl(this.data.role ? this.data.role.name : '', Validators.required),
      permissions: new FormControl(rolesIds, Validators.required),
    });
  }

  onSubmit(data) {
    this.data.role ? this.edit.emit(data) : this.create.emit(data);
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
