import { OrgLevelService } from './../../services/org-level.service';
import { ORG_LEVEL_TABLE_CONFIGURATION } from './../../models/org-level-table-configuration';
import { OrgLevel } from './../../models/org-level.model';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { OrgLevelFormComponent } from '../../components/org-level-form/org-level-form.component';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-org-level-page',
  templateUrl: './org-level-page.component.html',
  styleUrls: ['./org-level-page.component.scss'],
})
export class OrgLevelPageComponent implements OnInit, OnDestroy {
  roles: OrgLevel[];
  dataCount = 0;
  configuration = ORG_LEVEL_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;

  rowActionButtons = [
    {
      tooltipText: 'Editar Nivel Organizacional',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Nivel Organizacional',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteRole(item),
    },
  ];

  constructor(private orgLevelService: OrgLevelService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getOrgLevel();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getOrgLevel(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    this.loading = true;
    const sub = this.orgLevelService
      .getOrgLevel(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<OrgLevel>) => {
          this.roles = response.results.map((response) => {
            return { ...response };
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

  onChangePage(page: PageEvent) {
    this.getOrgLevel(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getOrgLevel(filters, 'id', 'desc');
  }

  createOrgLevel() {
    let dialogRef: MatDialogRef<OrgLevelFormComponent, any>;

    dialogRef = this.dialog.open(OrgLevelFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        orgLevel: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as OrgLevelFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((orgLevel: OrgLevel) =>
          this.orgLevelService.createOrgLevel(orgLevel).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el nivel organizacional. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getOrgLevel();
                this.toastService.success('El nivel organizacional fue creada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<OrgLevelFormComponent, any>;

    dialogRef = this.dialog.open(OrgLevelFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        role: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as OrgLevelFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((orgLevel: OrgLevel) =>
          this.orgLevelService.editRole({ ...orgLevel, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el nivel organizacinal. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getOrgLevel();
                this.toastService.success('El nivel organizacional fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteOrgLevel(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `Está seguro que desea eliminar el nivel organizacional: ${item.name}`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.orgLevelService.deleteOrgLevel(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el nivel organizacional. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getRoles();
                this.toastService.success('El nivel organizacional fue eliminado correctamente.', 'Felicidades');
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
    this.getOrgLevel(this.filters, sort.active, sort.direction);
  }
}