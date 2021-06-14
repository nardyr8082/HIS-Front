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
export class ValorService {
  url = environment.apiUrl + 'valor';
  urlId = environment.apiUrl + 'valor/:id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createValor(body: any): Observable < any > {
    return this.httpClient.post < any > (this.url, body);
  }

  editValor(data) {
    return this.httpClient.patch < any > (this.urlId.replace(':id', data.id), data, this.httpOptions);
  }

  removeValor(data): Promise < any > {
    return this.httpClient.delete < any > (this.urlId.replace(':id', data.id), this.httpOptions).toPromise();
  }

  getAllValors(query ? : IPagination, params ? : any) {
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

      if (params.name != undefined) {
        httpParams = httpParams.set(
          'filter[$and][name][$like]', '%' + params.name.toString() + '%');
      }
    }
    return this.httpClient.get < any > (this.url, {
      params: httpParams
    });
  }

  getValor(data: any): Observable < any > {
    if (data.constructor == Object) {
      return this.httpClient.get < any > (this.urlId.replace(':id', data.id), this.httpOptions);
    } else {
      return this.httpClient.get < any > (this.urlId.replace(':id', data + ''), this.httpOptions);
    }
  }
}