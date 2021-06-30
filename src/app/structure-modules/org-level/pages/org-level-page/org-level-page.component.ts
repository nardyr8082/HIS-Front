import { OrgLevelService } from './../../services/org-level.service';
import { ORG_LEVEL_TABLE_CONFIGURATION } from './../../models/org-level-table-configuration';
import { OrgLevel } from './../../models/org-level.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
  orgLevel: OrgLevel[];
  dataCount = 0;
  configuration = ORG_LEVEL_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Ubicación Organizacional',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Ubicación Organizacional',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteOrgLevel(item),
    },
  ];

  constructor(private orgLevelService: OrgLevelService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getOrgLevel();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getOrgLevel(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.orgLevelService
      .getOrgLevel(null, filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<any>) => {
          this.orgLevel = response.results.map((response) => {
            const nivel_padre = response.nivel_padre ? response.nivel_padre.name : '';
            const nivel_padre_id = response.nivel_padre ? response.nivel_padre.id : '';
            return { ...response, nivel_padre: nivel_padre, nivel_padre_id: nivel_padre_id };
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
    this.page = page.pageIndex + 1;
    this.pageSize = page.pageSize;
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
              this.toastService.error('Hubo un error al crear la Ubicación Organizacional. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getOrgLevel(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Ubicación Organizacional fue creada correctamente.', 'Felicidades');
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
        orgLevel: item,
      },
    });
    const modalComponentRef = dialogRef.componentInstance as OrgLevelFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((orgLevel: OrgLevel) =>
          this.orgLevelService.editOrgLevel({ ...orgLevel, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la Ubicación Organizacional. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getOrgLevel(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Ubicación Organizacional fue modificada correctamente.', 'Felicidades');
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
    modalComponentRef.text = `¿Está seguro que desea eliminar la Ubicación Organizacional: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.orgLevelService.deleteOrgLevel(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la Ubicación Organizacional. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getOrgLevel(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('La Ubicación Organizacional fue eliminada correctamente.', 'Felicidades');
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
