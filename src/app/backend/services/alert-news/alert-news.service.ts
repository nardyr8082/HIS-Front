import {
  environment
} from './../../../../environments/environment';
import {
  IPagination
} from './../../../core/classes/pagination.class';
import {
  Injectable
} from '@angular/core';
import {
  BehaviorSubject,
  Observable
} from 'rxjs';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AlertNewsService {
  url = environment.apiUrl + 'alert-news';
  urlId = environment.apiUrl + 'alert-news/:id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createAlertNews(body: any): Observable < any > {
    return this.httpClient.post < any > (this.url, body);
  }

  editAlertNews(data) {
    return this.httpClient.patch < any > (this.urlId.replace(':id', data.id), data, this.httpOptions);
  }

  removeAlertNews(data): Promise < any > {
    return this.httpClient.delete < any > (this.urlId.replace(':id', data.id), this.httpOptions).toPromise();
  }

  getAllAlertNewss(query ? : IPagination, params ? : any) {
    let httpParams = new HttpParams();
    if (query) {
      Object.keys(query).map((keyQuery) => {
        if (query[keyQuery] != undefined && keyQuery !== "filter") {
          httpParams = httpParams.append(keyQuery, query[keyQuery] + "");
        }
      });
      if (query.filter && query.filter.properties) {
        query.filter.properties.forEach((item) => {
          httpParams = httpParams.append(
            item,
            "%" + query.filter.filterText + "%"
          );
        });
      }
    }
    if (params) {

      if (params.title != undefined) {
        httpParams = httpParams.set(
          'filter[$and][title][$like]', '%' + params.title.toString() + '%');
      }
      if (params.summary != undefined) {
        httpParams = httpParams.set(
          'filter[$and][summary][$like]', '%' + params.summary.toString() + '%');
      }
      if (params.text != undefined) {
        httpParams = httpParams.set(
          'filter[$and][text][$like]', '%' + params.text.toString() + '%');
      }
    }
    return this.httpClient.get < any > (this.url, {
      params: httpParams
    });
  }

  getAlertNews(data: any): Observable < any > {
    if (data.constructor == Object) {
      return this.httpClient.get < any > (this.urlId.replace(':id', data.id), this.httpOptions);
    } else {
      return this.httpClient.get < any > (this.urlId.replace(':id', data + ''), this.httpOptions);
    }
  }
}