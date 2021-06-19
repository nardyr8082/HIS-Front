import { RaceService } from '../../services/race-service.service';
import { RACE_TABLE_CONFIGURATION } from '../../models/race-table-configuration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { Race } from '../../models/race.model';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RaceFormComponent } from '../../components/race-form/race-form.component';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-race-page',
  templateUrl: './race-page.component.html',
  styleUrls: ['./race-page.component.scss']
})
export class RacePageComponent implements OnInit, OnDestroy {
  race: Race[];
  dataCount = 0;
  configuration = RACE_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;

  rowActionButtons = [
    {
      tooltipText: 'Editar Raza',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar Raza',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteRace(item),
    },
  ];

  constructor(private raceService: RaceService, private toastService: ToastrService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getRace();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getRace(filters = this.filters, sortColumn = 'fecha', sortDirection = 'desc', page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    this.loading = true;
    const sub = this.raceService
      .getRace(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Race>) => {
          this.race = response.results;
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
    this.getRace(this.filters, 'fecha', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getRace(filters, 'fecha', 'desc');
  }

  createRace() {
    let dialogRef: MatDialogRef<RaceFormComponent, any>;

    dialogRef = this.dialog.open(RaceFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        catScience: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as RaceFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((race: Race) =>
          this.raceService.createRace(race).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear la raza. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getRace();
                this.toastService.success('La raza fue creada correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<RaceFormComponent, any>;

    dialogRef = this.dialog.open(RaceFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        race: item,
      },
    });
    console.log(item);
    const modalComponentRef = dialogRef.componentInstance as RaceFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((race: Race) =>
          this.raceService.editRace({ ...race, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar la raza. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getRace();
                this.toastService.success('La raza fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();
    this.subscriptions.push(sub);
  }

  deleteRace(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `Está seguro que desea eliminar la raza: ${item.descripcion}`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.raceService.deleteRace(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar la raza. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getRace();
                this.toastService.success('La raza fue eliminado correctamente.', 'Felicidades');
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
    this.getRace(this.filters, sort.active, sort.direction);
  }
}
