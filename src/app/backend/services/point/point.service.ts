import { environment } from './../../../../environments/environment';
import { IPagination } from './../../../core/classes/pagination.class';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PointService {
  url = environment.apiUrl + 'point';
  urlId = environment.apiUrl + 'point/:id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createPoint(body: any): Observable<any> {
    return this.httpClient.post<any>(this.url, body);
  }

  editPoint(data) {
    return this.httpClient.patch<any>(this.urlId.replace(':id', data.id), data, this.httpOptions);
  }

  removePoint(data): Promise<any> {
    return this.httpClient.delete<any>(this.urlId.replace(':id', data.id), this.httpOptions).toPromise();
  }

  getAllPoints(query?: IPagination, params?: any) {
    let httpParams = new HttpParams();
    if (query) {
      httpParams = httpParams.append('limit', query.limit.toString());
      httpParams = httpParams.append('offset', query.offset.toString());

      if (query.filter && query.filter.properties) {
        query.filter.properties.forEach((item) => {
          httpParams = httpParams.append(item, '%' + query.filter.filterText + '%');
        });
      }

      if (query.order) {
        httpParams = httpParams.append('order', query.order);
      }
    } else {
      httpParams = httpParams.set('limit', '0');
      httpParams = httpParams.set('offset', '0');
    }
    if (params) {
      if (params.isActive !== undefined) {
        httpParams = httpParams.set('filter[$and][isActive]', params.isActive ? '1' : '0');
      }
    }
    return this.httpClient.get<any>(this.url, { params: httpParams });
  }

  getPoint(data: any): Observable<any> {
    if (data.constructor === Object) {
      return this.httpClient.get<any>(this.urlId.replace(':id', data.id), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlId.replace(':id', data + ''), this.httpOptions);
    }
  }

  getProvinces(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'provincia');
  }

  getMunicipalities(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'municipio');
  }
}
