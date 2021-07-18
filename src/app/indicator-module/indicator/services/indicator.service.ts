import { environment } from '../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../app/core/models/api-response.model';
import { Indicator } from '../models/indicator.model';
import { Subcategory } from '../../classifiers/subcategory/models/subcategory.model';
import { IndicatorType } from '../../indicator-type/models/indicator-type.model';
import { Frequency } from '../../classifiers/frequency/models/frequency.model';
import { FrequencyFormComponent } from '../../classifiers/frequency/components/frequency-form/frequency-form.component';


//

@Injectable({
  providedIn: 'root',
})
export class IndicatorService {
  private apiEndpoint = `${environment.apiUrl}ind_indicador`;
  private apiEndpointSub = `${environment.apiUrl}ind_subcategoria`;
  private apiEndpointInd = `${environment.apiUrl}ind_tipo`;
  private apiEndpointFre = `${environment.apiUrl}ind_frecuencia`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getIndicator(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<Indicator>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<Indicator>>(this.apiEndpoint + queryParams);
  }

  getSubcategorys(): Observable<ApiResponse<Subcategory>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointSub);
  }

  getIndicatorTypes(): Observable<ApiResponse<IndicatorType>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointInd);
  }

  getFrequency(): Observable<ApiResponse<FrequencyFormComponent>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointFre);
  }
  
  private formatQueryParams(filters?: any, sortColumn?: string, sortDirection?: string, pageIndex?: number, pageSize?: number): string {
    let queryParams = '';

    if (filters) {
      for (const property in filters) {
        queryParams += queryParams.length > 0 ? '&' : '?';
        queryParams += `${property}=${filters[property]}`;
      }
    }

    if (sortColumn) {
      let ordering = '';

      if (sortDirection === 'desc') {
        ordering = '-';
      }
      ordering += sortColumn;
      queryParams += queryParams.length > 0 ? '&' : '?';
      queryParams += `ordering=${ordering}`;
    }

    if (pageIndex !== undefined) {
      queryParams += queryParams.length > 0 ? '&' : '?';
      queryParams += `page=${pageIndex}`;
    }

    if (pageSize !== undefined) {
      queryParams += queryParams.length > 0 ? '&' : '?';
      queryParams += `page_size=${pageSize}`;
    }

    return queryParams;
  }

  createIndicator(data: Indicator): Observable<Indicator> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editIndicator(data: Indicator): Observable<Indicator> {
    return this.http.patch<Indicator>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteIndicator(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
