import { ApiResponse } from './../../core/models/api-response.model';
import { environment } from './../../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';
//

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiEndpoint = `${environment.apiUrl}paciente`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'name';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getPatients(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<Patient>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<Patient>>(this.apiEndpoint + queryParams);
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

  createPatient(data: Patient): Observable<Patient> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editPatient(data: Patient): Observable<Patient> {
    return this.http.patch<Patient>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<any>(`${this.apiEndpoint}/${id}/`);
  }

  getQRCode(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}qr_code`, data);
  }

  uploadImagePatient(data, id): Observable<any> {
    return this.http.patch<any>(`${this.apiEndpoint}/${id}/`, data);
  }
}
