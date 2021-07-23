import { environment } from '../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../app/core/models/api-response.model';
import { Servicesstock } from '../models/servicesstock.model';
//

@Injectable({
  providedIn: 'root',
})
export class ServicesstockService {
  private apiEndpoint = `${environment.apiUrl}alm_servicio`;
  private apiEndpointUser = `${environment.apiUrl}usuario`;
  private apiEndpointOff = `${environment.apiUrl}departamento`;
  private apiEndpointImp = `${environment.apiUrl}alm_impuesto`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getServicesstock(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<Servicesstock>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<Servicesstock>>(this.apiEndpoint + queryParams);
  }
  getOffice(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointOff);
  }
  getImpuesto(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointImp);
  }
  getUser(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointUser);
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

  createServicesstock(data: Servicesstock): Observable<Servicesstock> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editServicesstock(data: Servicesstock): Observable<Servicesstock> {
    return this.http.patch<Servicesstock>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteServicesstock(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
