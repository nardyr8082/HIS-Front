import { User } from './../models/user.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
//

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiEndpoint = `${environment.apiUrl}usuario`;
  private defaultFilter: any = {};

  private defaultSortColumn: string = 'name';

  private defaultSortDirection: string = 'desc';

  private defaultPage: number = 0;

  private defaultPageSize: number = 10;

  constructor(private http: HttpClient) {}

  getUsers(filter: any, sortColumn: string, sortDirection: string, page: number, pageSize: number): Observable<ApiResponse<User>> {
    this.defaultFilter = filter;
    this.defaultSortColumn = sortColumn;
    this.defaultSortDirection = sortDirection;
    this.defaultPage = page;
    this.defaultPageSize = pageSize;

    const queryParams = this.formatQueryParams(filter, sortColumn, sortDirection, page, pageSize);
    return this.http.get<ApiResponse<User>>(this.apiEndpoint + queryParams);
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

  createUser(data: User): Observable<User> {
    return this.http.post<any>(`${this.apiEndpoint}/`, data);
  }

  editUser(data: User): Observable<User> {
    return this.http.patch<User>(`${this.apiEndpoint}/${data.id}/`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}/${id}/`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<any>(`${this.apiEndpoint}/${id}/`);
  }

  getQRCode(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}qr_code`, data);
  }
}
