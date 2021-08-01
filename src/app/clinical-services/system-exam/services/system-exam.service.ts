import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { SystemExam } from '../models/system-exam.model';
//

@Injectable({
  providedIn: 'root',
})
export class SystemExamService {
  private apiEndpoint = `${environment.apiUrl}adm_examen_sistema`;
  private apiEndpointF = `${environment.apiUrl}adm_examen_fisico_unico`;
  private apiEndpointS = `${environment.apiUrl}adm_sistema`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getSystemExam(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<SystemExam>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<SystemExam>>(this.apiEndpoint + queryParams);
  }
  getFisicExam(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointF);
  }

  getSystem(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointS);
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

  createSystemExam(data: SystemExam): Observable<SystemExam> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editSystemExam(data: SystemExam): Observable<SystemExam> {
    return this.http.patch<SystemExam>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteSystemExam(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
