import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { USER_TABLE_CONFIGURATION } from './../../models/user-table-configuration';
import { User } from './../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  users: User[];
  dataCount = 0;
  configuration = USER_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;

  rowActionButtons = [
    {
      tooltipText: 'Activar o desactivar',
      icon: 'check_circle_outline',
      color: 'warn',
      class: 'btn-warning',
      callback: (item) => this.disableOrEnableUser(item),
    },
    {
      tooltipText: 'Detalles del Usuario',
      icon: 'visibility',
      color: 'primary',
      class: 'btn-default',
      callback: (item) => this.goToDetails(item),
    },
    {
      tooltipText: 'Editar Usuario',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.goToForm(item),
    },
  ];

  constructor(private userService: UserService, private toastService: ToastrService, public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.getUsers();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getUsers(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    this.loading = true;
    const sub = this.userService
      .getUsers(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<User>) => {
          this.users = response.results.map((resp) => {
            const activo = resp.active ? '<p class="text-success">Si</p>' : '<p class="text-danger">No</p>';
            return { ...resp, activo };
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

  goToDetails(user?: User) {
    user ? this.router.navigateByUrl(`/user/details/${user.id}`) : this.router.navigateByUrl(`/user/create`);
  }

  goToForm(user?: User) {
    user ? this.router.navigateByUrl(`/user/edit/${user.id}`) : this.router.navigateByUrl(`/user/create`);
  }

  onChangeSort(sort: Sort) {
    // Change activo for active sort column
    // Beacuse activo is a custom field
    this.getUsers(this.filters, sort.active == 'activo' ? 'active' : sort.active, sort.direction);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getUsers(filters, 'id', 'desc');
  }

  onChangePage(page: PageEvent) {
    this.getUsers(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  disableOrEnableUser(item: User) {
    const newUser = { id: item.id, active: !item.active };
    const sub = this.userService
      .editUser(newUser)
      .pipe(
        map(() => {
          this.getUsers();
          !item.active
            ? this.toastService.success(`El usuario ${item.username} fue activado correctamente.`, 'Felicidades')
            : this.toastService.warning(`El usuario ${item.username} fue desactivado.`, 'Atención');
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteUser(item: User) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el usuario: ${item.first_name} ${item.last_name}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.userService.deleteUser(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el usuario. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getUsers();
                this.toastService.success('El usuario fue eliminado correctamente.', 'Felicidades');
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
}
