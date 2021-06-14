import { environment } from './../../../../environments/environment';
import { IPagination } from './../../../core/classes/pagination.class';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TitleSectionService {
  url = environment.apiUrl + 'title-section';
  urlId = environment.apiUrl + 'title-section/:id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createTitleSection(body: any): Observable<any> {
    return this.httpClient.post<any>(this.url, body);
  }

  editTitleSection(data) {
    return this.httpClient.patch<any>(this.urlId.replace(':id', data.id), data, this.httpOptions);
  }

  removeTitleSection(data): Promise<any> {
    return this.httpClient.delete<any>(this.urlId.replace(':id', data.id), this.httpOptions).toPromise();
  }

  getAllTitleSections(query?: IPagination, params?: any) {
    let httpParams = new HttpParams();
    if (query) {
      Object.keys(query).map((keyQuery) => {
        if (query[keyQuery] != undefined && keyQuery !== 'filter') {
          httpParams = httpParams.append(keyQuery, query[keyQuery] + '');
        }
      });
      if (query.filter && query.filter.properties) {
        query.filter.properties.forEach((item) => {
          httpParams = httpParams.append(item, '%' + query.filter.filterText + '%');
        });
      }
    }
    if (params) {
      if (params.miniTitle != undefined) {
        httpParams = httpParams.set('filter[$and][miniTitle][$like]', '%' + params.miniTitle.toString() + '%');
      }
      if (params.miniSubTitle != undefined) {
        httpParams = httpParams.set('filter[$and][miniSubTitle][$like]', '%' + params.miniSubTitle.toString() + '%');
      }
      if (params.miniHeaderText != undefined) {
        httpParams = httpParams.set('filter[$and][miniHeaderText][$like]', '%' + params.miniHeaderText.toString() + '%');
      }
      if (params.bigTitle != undefined) {
        httpParams = httpParams.set('filter[$and][bigTitle][$like]', '%' + params.bigTitle.toString() + '%');
      }
      if (params.bigSubTitle != undefined) {
        httpParams = httpParams.set('filter[$and][bigSubTitle][$like]', '%' + params.bigSubTitle.toString() + '%');
      }
      if (params.bigHeaderText != undefined) {
        httpParams = httpParams.set('filter[$and][bigHeaderText][$like]', '%' + params.bigHeaderText.toString() + '%');
      }
      if (params.type != undefined) {
        if (params.type.constructor != Array) {
          httpParams = httpParams.set('filter[$and][type]', params.type.toString());
        }
        if (params.type.constructor == Array && params.type.length) {
          if (params.type.length == 1) {
            httpParams = httpParams.set('filter[$and][type]', params.type[0].toString());
          } else {
            params.type.map((item) => {
              httpParams = httpParams.append('filter[$and][type]', item.toString());
            });
          }
        }
      }
    }
    return this.httpClient.get<any>(this.url, {
      params: httpParams,
    });
  }

  getTitleSection(data: any): Observable<any> {
    if (data.constructor == Object) {
      return this.httpClient.get<any>(this.urlId.replace(':id', data.id), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlId.replace(':id', data + ''), this.httpOptions);
    }
  }
}
