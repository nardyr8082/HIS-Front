import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Subcategory } from '../models/subcategory.model';
import { Category } from '../../category/models/category.model';
//

@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {
  private apiEndpoint = `${environment.apiUrl}ind_subcategoria`;
  private apiEndpointC = `${environment.apiUrl}ind_categoria`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getSubcategory(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<Subcategory>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<Subcategory>>(this.apiEndpoint + queryParams);
  }
  getCategory(): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointC);
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

  createSubcategory(data: Subcategory): Observable<Subcategory> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editSubcategory(data: Subcategory): Observable<Subcategory> {
    return this.http.patch<Subcategory>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteSubcategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
