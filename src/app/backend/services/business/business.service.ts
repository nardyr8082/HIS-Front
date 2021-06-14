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
export class BusinessService {
  url = environment.apiUrl + 'business';
  urlId = environment.apiUrl + 'business/:id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createBusiness(body: any): Observable < any > {
    return this.httpClient.post < any > (this.url, body);
  }

  editBusiness(data) {
    return this.httpClient.patch < any > (this.urlId.replace(':id', data.id), data, this.httpOptions);
  }

  removeBusiness(data): Promise < any > {
    return this.httpClient.delete < any > (this.urlId.replace(':id', data.id), this.httpOptions).toPromise();
  }

  getAllBusinesss(query ? : IPagination, params ? : any) {
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
      if (params.apiUrl != undefined) {
        httpParams = httpParams.set(
          'filter[$and][apiUrl][$like]', '%' + params.apiUrl.toString() + '%');
      }
      if (params.businessUUID != undefined) {
        httpParams = httpParams.set(
          'filter[$and][businessUUID][$like]', '%' + params.businessUUID.toString() + '%');
      }
      if (params.hiddenCode != undefined) {
        httpParams = httpParams.set(
          'filter[$and][hiddenCode][$like]', '%' + params.hiddenCode.toString() + '%');
      }
    }
    return this.httpClient.get < any > (this.url, {
      params: httpParams
    });
  }

  getBusiness(data: any): Observable < any > {
    if (data.constructor == Object) {
      return this.httpClient.get < any > (this.urlId.replace(':id', data.id), this.httpOptions);
    } else {
      return this.httpClient.get < any > (this.urlId.replace(':id', data + ''), this.httpOptions);
    }
  }
}