import { environment } from '../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../app/core/models/api-response.model';
import { VariableIndicator } from '../models/variable-indicator.model';
import { Indicator } from '../../indicator/models/indicator.model';
//

@Injectable({
  providedIn: 'root',
})
export class VariableIndicatorService {
  private apiEndpoint = `${environment.apiUrl}ind_indicador_variable`;
  private apiEndpointC = `${environment.apiUrl}ind_indicador`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getVariableIndicator(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<VariableIndicator>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<VariableIndicator>>(this.apiEndpoint + queryParams);
  }
  getIndicator(): Observable<ApiResponse<Indicator>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointC);
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

  createVariableIndicator(data: VariableIndicator): Observable<VariableIndicator> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editVariableIndicator(data: VariableIndicator): Observable<VariableIndicator> {
    return this.http.patch<VariableIndicator>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteVariableIndicator(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
