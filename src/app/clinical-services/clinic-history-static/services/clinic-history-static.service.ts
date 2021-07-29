import { environment } from '../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../app/core/models/api-response.model';
import { ClinicHistoryStatic } from '../models/clinic-history-static.model';
import { Patient } from 'src/app/patient/models/patient.model';
@Injectable({
  providedIn: 'root'
})
export class ClinicHistoryStaticService {
  private apiEndpoint = `${environment.apiUrl}adm_historia_clinica`;
  private apiEndpointPatient = `${environment.apiUrl}paciente`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) { }

  getClinicHistoryStatic(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<ClinicHistoryStatic>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<ClinicHistoryStatic>>(this.apiEndpoint + queryParams);

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

  getPatient(): Observable<ApiResponse<Patient>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointPatient);
  }


  createClinicHistoryStatic(data: ClinicHistoryStatic): Observable<ClinicHistoryStatic> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editClinicHistoryStatic(data: ClinicHistoryStatic): Observable<ClinicHistoryStatic> {

    return this.http.patch<ClinicHistoryStatic>(`${this.apiEndpoint}/${data.id}/`, data);

  }

  deleteClinicHistoryStatic(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }










}
