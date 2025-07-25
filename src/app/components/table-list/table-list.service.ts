import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TableListService {

  constructor(private http: HttpClient) {}

  getItems(url: any, body: any): Observable<any> {
    return this.http.get(environment.apiUrl + url, body);
  }
  getItemsPost(url: any, body: any): Observable<any> {
    return this.http.post(environment.apiUrl + url, body);
  }
}
