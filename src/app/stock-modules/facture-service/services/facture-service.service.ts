import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { FactureServiceModel } from '../models/facture-service.model';

//

@Injectable({
  providedIn: 'root',
})
export class FactureServiceService {
  private apiEndpoint = `${environment.apiUrl}alm_factura_servicio`;
  private apiEndpointEst = `${environment.apiUrl}alm_estado_factura`;
  private apiEndpointCom = `${environment.apiUrl}usuario`;
  private apiEndpointOpe = `${environment.apiUrl}alm_operacion_comercial`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'id';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getFactureService(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<FactureServiceModel>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<FactureServiceModel>>(this.apiEndpoint + queryParams);
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

  createFactureService(data: FactureServiceModel): Observable<FactureServiceModel> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editFactureService(data: FactureServiceModel): Observable<FactureServiceModel> {
    return this.http.patch<FactureServiceModel>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteFactureService(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }
}
