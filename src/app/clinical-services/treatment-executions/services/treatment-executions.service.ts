import { Injectable } from '@angular/core';
import { environment } from '../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../app/core/models/api-response.model';
import { ClinicalSection } from '../../treatment-indications/models/clinical-section.model';
import { User } from 'src/app/security-module/user/models/user.model';
import { TreatmentExecutions } from '../models/treatment-executions.model';
@Injectable({
  providedIn: 'root'
})
export class TreatmentExecutionsService {
  private apiEndpoint = `${environment.apiUrl}adm_tratamientos_ejecuciones`;
  private apiEndpointClinicalSection = `${environment.apiUrl}adm_sesion_clinica`;
  private apiEndpointUser = `${environment.apiUrl}usuario`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) { }

  getTreatmentExecutions(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<TreatmentExecutions>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<TreatmentExecutions>>(this.apiEndpoint + queryParams);

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

  getClinicalSection(): Observable<ApiResponse<ClinicalSection>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointClinicalSection);
  }

  getUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointUser);
  }


  createTreatmentExecutions(data: TreatmentExecutions): Observable<TreatmentExecutions> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editTreatmentExecutions(data: TreatmentExecutions): Observable<TreatmentExecutions> {

    return this.http.patch<TreatmentExecutions>(`${this.apiEndpoint}/${data.id}/`, data);

  }

  deleteTreatmentExecutions(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }




}
