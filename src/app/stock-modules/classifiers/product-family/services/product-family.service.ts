import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ProductFamily } from '../models/product-family.model';
//

@Injectable({
  providedIn: 'root',
})
export class ProductFamilyService {
  private apiEndpoint = `${environment.apiUrl}alm_familia_producto`;
  private defaultFilter: any = {};
  private defaultExclude: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getProductFamily(exclude: number, filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<ProductFamily>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;
    this.defaultExclude = exclude;

    const queryParams = this.formatQueryParams(exclude, filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<ProductFamily>>(this.apiEndpoint + queryParams);
  }

  private formatQueryParams(exclude?: number, filters?: any, sortColumn?: string, sortDirection?: string, pageIndex?: number, pageSize?: number): string {
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

    if (exclude) {
      queryParams += queryParams.length > 0 ? '&' : '?';
      queryParams += `exclude=${exclude}`;
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

  createProductFamily(data: ProductFamily): Observable<ProductFamily> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editProductFamily(data: ProductFamily): Observable<ProductFamily> {
    return this.http.patch<ProductFamily>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteProductFamily(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
