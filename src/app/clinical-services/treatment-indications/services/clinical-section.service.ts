import { Injectable } from '@angular/core';
import { environment } from '../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../app/core/models/api-response.model';
import { ClinicalSection } from '../models/clinical-section.model';

@Injectable({
  providedIn: 'root'
})
export class ClinicalSectionService {
  private apiEndpoint = `${environment.apiUrl}adm_sesion_clinica`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) { }

  getClinicalSection(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<ClinicalSection>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<ClinicalSection>>(this.apiEndpoint + queryParams);

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

  createClinicalSection(data: ClinicalSection): Observable<ClinicalSection> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editClinicalSection(data: ClinicalSection): Observable<ClinicalSection> {

    return this.http.patch<ClinicalSection>(`${this.apiEndpoint}/${data.id}/`, data);

  }

  deleteClinicalSection(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }

}
