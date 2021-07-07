import { MetaTableField } from './../models/MetaTableField/MetaTableField.model';
import { ApiResponse } from '../../core/models/api-response.model';

import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';

//

@Injectable({
  providedIn: 'root',
})
export class MetaTableFieldService {
  private apiEndpoint = `${environment.apiUrl}meta_table_fields`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getMetaTableFields(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<MetaTableField>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<MetaTableField>>(this.apiEndpoint + queryParams);
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

  createMetaTableField(data: MetaTableField): Observable<MetaTableField> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  createMultipleMetaTableField(data: MetaTableField[]): Observable<MetaTableField> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editMetaTableField(data: MetaTableField): Observable<MetaTableField> {
    return this.http.patch<MetaTableField>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  editMultipleMetaTableField(data: MetaTableField[], id): Observable<MetaTableField> {
    return this.http.patch<MetaTableField>(`${this.apiEndpoint}/${id}/`, data);
  }

  deleteMetaTableField(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }

  getMetaTableFieldById(id: number): Observable<MetaTableField> {
    return this.http.get<any>(`${this.apiEndpoint}/${id}/`);
  }
}
