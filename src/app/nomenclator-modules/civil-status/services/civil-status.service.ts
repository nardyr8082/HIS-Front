import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from 'src/app/core/models/api-response.model';
import { CivilStatus } from '../models/civil-status.model';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CivilStatusService {
  private apiEndpoint = `${environment.apiUrl}estado_civil`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'description';
  private defaultSortDirection: string = 'desc';
  private defaultPage: number = 0;
  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) { }

  getCivilStatus(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<CivilStatus>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<CivilStatus>>(this.apiEndpoint + queryParams);
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

  createCivilStatus(data: CivilStatus): Observable<CivilStatus> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editCivilStatus(data: CivilStatus): Observable<CivilStatus> {
    return this.http.put<CivilStatus>(`${this.apiEndpoint}/${data.id}/`, data)
  }

  deleteCivilStatus(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
