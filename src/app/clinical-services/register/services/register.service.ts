import { environment } from '../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../app/core/models/api-response.model';
import { Register } from '../models/register.model';
//

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiEndpoint = `${environment.apiUrl}adm_registro`;
  private apiEndpointSession = `${environment.apiUrl}adm_sesion_clinica`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getRegister(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<Register>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<Register>>(this.apiEndpoint + queryParams);
  }

  getClinicSession(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointSession);
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

  createRegister(data: Register): Observable<Register> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editRegister(data: Register): Observable<Register> {
    return this.http.patch<Register>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteRegister(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
