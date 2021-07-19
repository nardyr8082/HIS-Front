import { environment } from '../../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../../app/core/models/api-response.model';
import { InventoryCount } from '../models/inventory-count.model';
//

@Injectable({
  providedIn: 'root',
})
export class InventoryCountService {
  private apiEndpoint = `${environment.apiUrl}alm_inventario_conteo`;
  private apiEndpointInv = `${environment.apiUrl}alm_inventario`;
  private apiEndpointExi = `${environment.apiUrl}alm_existencia`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getInventoryCount(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<InventoryCount>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<InventoryCount>>(this.apiEndpoint + queryParams);
  }
  getInventario(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointInv);
  }

  getExistencia(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointExi);
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

  createInventoryCount(data: InventoryCount): Observable<InventoryCount> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editInventoryCount(data: InventoryCount): Observable<InventoryCount> {
    return this.http.patch<InventoryCount>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteInventoryCount(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
