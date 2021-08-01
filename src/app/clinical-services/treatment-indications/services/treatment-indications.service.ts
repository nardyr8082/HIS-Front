import { Injectable } from '@angular/core';
import { environment } from '../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../app/core/models/api-response.model';
import { TreatmentIndications } from '../models/treatment-indications.model';
import { ClinicalSection } from '../models/clinical-section.model';
@Injectable({
  providedIn: 'root'
})
export class TreatmentIndicationsService {
  private apiEndpoint = `${environment.apiUrl}adm_tratamientos_indicaciones`;
  private apiEndpointClinicalSection = `${environment.apiUrl}adm_sesion_clinica`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) { }

  getTreatmentIndications(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<TreatmentIndications>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<TreatmentIndications>>(this.apiEndpoint + queryParams);

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


  createTreatmentIndications(data: TreatmentIndications): Observable<TreatmentIndications> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editTreatmentIndications(data: TreatmentIndications): Observable<TreatmentIndications> {

    return this.http.patch<TreatmentIndications>(`${this.apiEndpoint}/${data.id}/`, data);

  }

  deleteTreatmentIndications(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }




}
