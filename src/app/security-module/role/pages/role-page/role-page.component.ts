import { RoleService } from './../../services/role.service';
import { ROLE_TABLE_CONFIGURATION } from './../../models/role-table-configuration';
import { Permission, Role } from './../../models/role.model';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { RoleFormComponent } from '../../components/role-form/role-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-role-page',
  templateUrl: './role-page.component.html',
  styleUrls: ['./role-page.component.scss'],
})
export class RolePageComponent implements OnInit {
  roles: Role[];
  dataCount = 0;
  configuration = ROLE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Rol',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Rol',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteRole(item),
    },
  ];

  constructor(private roleService: RoleService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getRoles();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getRoles(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.roleService
      .getRoles(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Role>) => {
          this.roles = response.results.map((response) => {
            const permissions_string = this.getPermissionsString(response.permissions);
            return { ...response, permissions_string: permissions_string };
          });
          this.dataCount = response.count;
          this.loading = false;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los datos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          this.loading = false;
          return null;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  getPermissionsString(permissions: Permission[]) {
    let permissions_string = '';
    permissions.forEach((permission) => {
      permissions_string = permissions_string.concat(`${permission.name}, `);
    });
    // To remove the last blank space and comma
    return permissions_string.substring(0, permissions_string.length - 2);
  }

  onChangePage(page: PageEvent) {
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.getRoles(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getRoles(filters, 'id', 'desc');
  }

  createRole() {
    let dialogRef: MatDialogRef<RoleFormComponent, any>;

    dialogRef = this.dialog.open(RoleFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        role: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as RoleFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((role: Role) =>
          this.roleService.createRole(role).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el rol. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getRoles(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El rol fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<RoleFormComponent, any>;

    dialogRef = this.dialog.open(RoleFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        role: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as RoleFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((role: Role) =>
          this.roleService.editRole({ ...role, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el rol. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getRoles(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El rol fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteRole(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el rol: ${item.name}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.roleService.deleteRole(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el rol. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getRoles(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El rol fue eliminado correctamente.', 'Felicidades');
                modalRef.close();
              }
            }),
          ),
        ),
      )
      .subscribe();

    const sub1 = modalComponentRef.cancel.pipe(tap(() => modalRef.close())).subscribe();
    this.subscriptions.push(sub, sub1);
  }

  onChangeSort(sort: Sort) {
    this.getRoles(this.filters, sort.active, sort.direction);
  }
}
