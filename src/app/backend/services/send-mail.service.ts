import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class SendMailService {
  url = environment.apiUrl + 'send-mail';

  constructor(private httpClient: HttpClient) { }

  sendEmail(data): Observable<any> {
    return this.httpClient.post<any>(this.url, data);
  }
}
