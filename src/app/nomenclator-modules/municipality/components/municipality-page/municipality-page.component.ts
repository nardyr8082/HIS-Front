import { MunicipalityService } from './../../services/municipality.service';
import { MUNICIPALITY_TABLE_CONFIGURATION } from './../../models/municipality-table-configuration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, DEFAULT_PAGE_SIZE } from 'src/app/core/models/api-response.model';
import { Municipality } from '../../models/municipality.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-municipality-page',
  templateUrl: './municipality-page.component.html',
  styleUrls: ['./municipality-page.component.scss'],
})
export class MunicipalityPageComponent implements OnInit, OnDestroy {
  municipalities: Municipality[];
  dataCount = 0;
  configuration = MUNICIPALITY_TABLE_CONFIGURATION;
  subscriptions: Subscription[] = [];
  filters = {};

  constructor(private municipalityService: MunicipalityService, private toastService: ToastrService) {}

  ngOnInit(): void {
    this.getMunicipalities();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getMunicipalities(filters = this.filters, sortColumn = 'fecha', sortDirection = 'desc', page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    const sub = this.municipalityService
      .getMunicipalities(filters, sortColumn, sortDirection, page, pageSize)
      .pipe(
        map((response: ApiResponse<Municipality>) => {
          this.municipalities = response.results;
          this.dataCount = response.count;
        }),
        catchError(() => {
          this.toastService.error('Hubo un error al obtener los datos. Por favor, inténtelo de nuevo más tarde.', 'Error');
          return null;
        }),
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  onChangePage(page: PageEvent) {
    this.getMunicipalities(this.filters, 'fecha', 'desc', page.pageIndex + 1, page.pageSize);
  }

  onChangeFilter(filters) {
    this.filters = filters;
    this.getMunicipalities(filters, 'fecha', 'desc');
  }
}
