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
export class MarcaService {
  url = environment.apiUrl + 'marca';
  urlId = environment.apiUrl + 'marca/:id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createMarca(body: any): Observable < any > {
    return this.httpClient.post < any > (this.url, body);
  }

  editMarca(data) {
    return this.httpClient.patch < any > (this.urlId.replace(':id', data.id), data, this.httpOptions);
  }

  removeMarca(data): Promise < any > {
    return this.httpClient.delete < any > (this.urlId.replace(':id', data.id), this.httpOptions).toPromise();
  }

  getAllMarcas(query ? : IPagination, params ? : any) {
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
      if (params.text != undefined) {
        httpParams = httpParams.set(
          'filter[$and][text][$like]', '%' + params.text.toString() + '%');
      }
      if (params.link != undefined) {
        httpParams = httpParams.set(
          'filter[$and][link][$like]', '%' + params.link.toString() + '%');
      }
    }
    return this.httpClient.get < any > (this.url, {
      params: httpParams
    });
  }

  getMarca(data: any): Observable < any > {
    if (data.constructor == Object) {
      return this.httpClient.get < any > (this.urlId.replace(':id', data.id), this.httpOptions);
    } else {
      return this.httpClient.get < any > (this.urlId.replace(':id', data + ''), this.httpOptions);
    }
  }
}