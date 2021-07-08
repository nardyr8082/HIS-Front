import { ApiResponse } from '../../core/models/api-response.model';

import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ClinicHistory } from '../models/CLinicHistory/clinicHistory.model';

//

@Injectable({
  providedIn: 'root',
})
export class ClinicHistoryService {
  private apiEndpoint = `${environment.apiUrl}meta_datarecord`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getClinicHistories(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<ClinicHistory>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<ClinicHistory>>(this.apiEndpoint + queryParams);
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

  createClicnicHistory(data: ClinicHistory): Observable<ClinicHistory> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  createMultipleClicnicHistory(data: ClinicHistory[]): Observable<ClinicHistory> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editClicnicHistory(data: ClinicHistory): Observable<ClinicHistory> {
    return this.http.patch<ClinicHistory>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteClicnicHistory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
