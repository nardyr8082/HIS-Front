import { ProgramService } from '../../services/program.service';
import { PROGRAM_TABLE_CONFIGURATION } from '../../models/program-table-configuration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { Program } from '../../models/program.model';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProgramFormComponent } from '../../components/program-form/program-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-program-page',
  templateUrl: './program-page.component.html',
  styleUrls: ['./program-page.component.scss'],
})
export class ProgramPageComponent implements OnInit, OnDestroy {
  programs: Program[];
  dataCount = 0;
  configuration = PROGRAM_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar Programa',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Programa',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteProgram(item),
    },
  ];

  constructor(private programService: ProgramService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getPrograms();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getPrograms(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.programService
      .getPrograms(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Program>) => {
          this.programs = response.results;
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
    this.getPrograms(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getPrograms(filters, 'id', 'desc');
  }

  createProgram() {
    let dialogRef: MatDialogRef<ProgramFormComponent, any>;

    dialogRef = this.dialog.open(ProgramFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        program: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ProgramFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((program: Program) =>
          this.programService.createProgram(program).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el programa. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPrograms(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El programa fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<ProgramFormComponent, any>;

    dialogRef = this.dialog.open(ProgramFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        program: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as ProgramFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((program: Program) =>
          this.programService.editProgram({ ...program, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el programa. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPrograms(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El programa fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteProgram(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el programa: ${item.descripcion}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.programService.deleteProgram(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el programa. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getPrograms(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El programa fue eliminado correctamente.', 'Felicidades');
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

  changeSort(sort: Sort) {
    this.getPrograms(this.filters, sort.active, sort.direction);
  }
}
