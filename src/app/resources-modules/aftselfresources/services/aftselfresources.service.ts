import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Aftselfresources } from '../models/aftselfresources.model';

//

@Injectable({
  providedIn: 'root',
})
export class AftselfresourcesService {
  private apiEndpoint = `${environment.apiUrl}aft_recurso_propio`;
  private apiEndpointStatus = `${environment.apiUrl}aft_estado_recurso`;
  private apiEndpointOffice = `${environment.apiUrl}departamento`;
  private apiEndpointPatient = `${environment.apiUrl}paciente`;
  private apiEndpointCla = `${environment.apiUrl}aft_clasificador_recurso`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getAftselfresources(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<Aftselfresources>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<Aftselfresources>>(this.apiEndpoint + queryParams);
  }
  getStatus(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointStatus);
  }
  getClassificator(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointCla);
  }
  getOffice(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointOffice);
  }
  getPatient(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointPatient);
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

  createAftselfresources(data: Aftselfresources): Observable<Aftselfresources> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editAftselfresources(data: Aftselfresources): Observable<Aftselfresources> {
    return this.http.patch<Aftselfresources>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteAftselfresources(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
