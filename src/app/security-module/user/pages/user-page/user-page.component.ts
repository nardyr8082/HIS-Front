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
      tooltipText: 'Editar Grupo',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.goToForm(item),
    },
    {
      tooltipText: 'Eliminar Grupo',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteUser(item),
    },
  ];

  constructor(private userService: UserService, private toastService: ToastrService, public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.getUsers();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getUsers(filters = this.filters, sortColumn = 'fecha', sortDirection = 'desc', page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    this.loading = true;
    const sub = this.userService
      .getUsers(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<User>) => {
          this.users = response.results;
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

  goToForm(user?: User) {
    user ? this.router.navigateByUrl(`/user/edit/${user.id}`) : this.router.navigateByUrl(`/user/create`);
  }

  onChangeSort(sort: Sort) {
    this.getUsers(this.filters, sort.active, sort.direction);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getUsers(filters, 'fecha', 'desc');
  }

  onChangePage(page: PageEvent) {
    this.getUsers(this.filters, 'fecha', 'desc', page.pageIndex + 1, page.pageSize);
  }

  deleteUser(item: User) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `Está seguro que desea eliminar el usuario: ${item.first_name} ${item.last_name}`;

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
