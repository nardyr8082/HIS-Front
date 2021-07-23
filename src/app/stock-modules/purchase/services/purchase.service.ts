import { environment } from './../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Purchase } from '../models/purchase.model';
//

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private apiEndpoint = `${environment.apiUrl}alm_compra`;
  private apiEndpointEst = `${environment.apiUrl}alm_estado_movimiento`;
  private apiEndpointUser = `${environment.apiUrl}usuario`;
  private apiEndpointAlm = `${environment.apiUrl}alm_almacen`;
  private apiEndpointTmov = `${environment.apiUrl}alm_tipo_de_movimiento`;
  private apiEndpointPro = `${environment.apiUrl}alm_proveedor`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getPurchase(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<Purchase>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<Purchase>>(this.apiEndpoint + queryParams);
  }
  getEstado(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointEst);
  }

  getUsuario(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointUser);
  }

  getAlmacen(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointAlm);
  }

  getTipo_Mov(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointTmov);
  }

  getProveedor(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointPro);
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

  createPurchase(data: Purchase): Observable<Purchase> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editPurchase(data: Purchase): Observable<Purchase> {
    return this.http.patch<Purchase>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deletePurchase(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
