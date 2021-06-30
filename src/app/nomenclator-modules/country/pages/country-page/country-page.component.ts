import { CountryFormComponent } from './../../components/country-form/country-form.component';
import { CountryService } from './../../services/country.service';
import { COUNTRY_TABLE_CONFIGURATION } from './../../models/country-table-configuration';
import { Country } from './../../models/country.model';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from 'src/app/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styleUrls: ['./country-page.component.scss'],
})
export class CountryPageComponent implements OnInit {
  countries: Country[];
  dataCount = 0;
  configuration = COUNTRY_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};
  loading = false;
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  rowActionButtons = [
    {
      tooltipText: 'Editar País',
      icon: 'edit',
      color: 'primary',
      class: 'btn-primary',
      callback: (item) => this.openEditForm(item),
    },
    {
      tooltipText: 'Eliminar País',
      icon: 'delete',
      color: 'warn',
      class: 'btn-danger',
      callback: (item) => this.deleteCountry(item),
    },
  ];

  constructor(private countryService: CountryService, private toastService: ToastrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getCountries();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getCountries(filters = this.filters, sortColumn = 'id', sortDirection = 'desc', page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    const sub = this.countryService
      .getCountries(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Country>) => {
          this.countries = response.results;
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
    this.getCountries(this.filters, 'id', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getCountries(filters, 'id', 'desc');
  }

  createCountry() {
    let dialogRef: MatDialogRef<CountryFormComponent, any>;

    dialogRef = this.dialog.open(CountryFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        country: null,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as CountryFormComponent;

    const sub = modalComponentRef.create
      .pipe(
        switchMap((country: Country) =>
          this.countryService.createCountry(country).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al crear el país. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCountries(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El país fue creado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  openEditForm(item) {
    let dialogRef: MatDialogRef<CountryFormComponent, any>;

    dialogRef = this.dialog.open(CountryFormComponent, {
      panelClass: 'app-dialog-add-edit-business',
      maxWidth: '500px',
      minWidth: '150px',
      maxHeight: '100vh',
      width: '100%',
      data: {
        country: item,
      },
    });

    const modalComponentRef = dialogRef.componentInstance as CountryFormComponent;

    const sub = modalComponentRef.edit
      .pipe(
        switchMap((country: Country) =>
          this.countryService.editCountry({ ...country, id: item.id }).pipe(
            catchError(() => {
              this.toastService.error('Hubo un error al editar el país. Por favor, inténtelo de nuevo más tarde.', 'Error');
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCountries(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El país fue modificado correctamente.', 'Felicidades');
              }
            }),
          ),
        ),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  deleteCountry(item) {
    const modalRef = this.dialog.open(DeleteConfirmationModalComponent);

    const modalComponentRef = modalRef.componentInstance as DeleteConfirmationModalComponent;
    modalComponentRef.text = `¿Está seguro que desea eliminar el país: ${item.nombre}?`;

    const sub = modalComponentRef.accept
      .pipe(
        filter((accept) => accept),
        switchMap(() =>
          this.countryService.deleteCountry(item.id).pipe(
            map(() => item),
            catchError(() => {
              this.toastService.error('Hubo un error al eliminar el país. Por favor, inténtelo de nuevo más tarde.', 'Error');
              modalRef.close();
              return of(null);
            }),
            tap((success) => {
              if (success) {
                this.getCountries(this.filters, 'id', 'desc', this.page, this.pageSize);
                this.toastService.success('El país fue eliminado correctamente.', 'Felicidades');
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
    this.getCountries(this.filters, sort.active, sort.direction);
  }
}
