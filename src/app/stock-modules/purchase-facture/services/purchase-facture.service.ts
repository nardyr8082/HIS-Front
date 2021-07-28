import { environment } from './../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PurchaseFacture } from '../models/purchase-facture.model';
//

@Injectable({
  providedIn: 'root',
})
export class PurchaseFactureService {
  private apiEndpoint = `${environment.apiUrl}alm_factura_compra`;
  private apiEndpointEst = `${environment.apiUrl}alm_estado_factura`;
  private apiEndpointCom = `${environment.apiUrl}usuario`;
  private apiEndpointOpe = `${environment.apiUrl}alm_operacion_comercial`;
  private apiEndpointComp = `${environment.apiUrl}alm_compra`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getPurchaseFacture(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<PurchaseFacture>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<PurchaseFacture>>(this.apiEndpoint + queryParams);
  }
  getEstado(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointEst);
  }

  getComercial(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointCom);
  }

  getOperacion(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointOpe);
  }

  getCompra(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiEndpointComp);
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

  createPurchaseFacture(data: PurchaseFacture): Observable<PurchaseFacture> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editPurchaseFacture(data: PurchaseFacture): Observable<PurchaseFacture> {
    return this.http.patch<PurchaseFacture>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deletePurchaseFacture(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
