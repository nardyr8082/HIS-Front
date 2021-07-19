import { environment } from '../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../app/core/models/api-response.model';
import { Existence } from '../models/existence.model';
import { ProductCategory } from '../../classifiers/product-category/models/product-category.model';



@Injectable({
  providedIn: 'root'
})
export class ExistenceService {
  private apiEndpoint = `${environment.apiUrl}alm_existencia`;
  private apiEndpointCatProd = `${environment.apiUrl}alm_categoria_producto`;

  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) { }

  getExistence(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<Existence>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<Existence>>(this.apiEndpoint + queryParams);
  }

  getCategoryProduct(): Observable<ApiResponse<ProductCategory>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointCatProd);
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

  createExistence(data: Existence): Observable<Existence> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editExistence(data: Existence): Observable<Existence> {

    return this.http.patch<Existence>(`${this.apiEndpoint}/${data.id}/`, data);

  }

  deleteExistence(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }

}
