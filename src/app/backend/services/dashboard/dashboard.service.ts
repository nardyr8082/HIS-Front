import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiEndpoint = `${environment.apiUrl}dashboard_data`;
  constructor(private http: HttpClient) { }
  getDashboardData(): Observable<any> {
    return this.http.get<any>(this.apiEndpoint) as Observable<any>;
  }
}
