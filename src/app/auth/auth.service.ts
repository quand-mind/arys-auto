import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { CookieService } from "ngx-cookie-service";
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private cookies: CookieService) {}

  login(userformData: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/api/v1/auth/signIn', userformData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    });
  }
  setToken(token: string) {
    localStorage.setItem("token", token);
  }
  getToken() {
    return localStorage.getItem("token");
  }
  getTipoSistema() {
    return localStorage.getItem("ctipo_sistema");
  }
  getUsuario() {
    return localStorage.getItem("cusuario");
  }
  getRol() {
    return localStorage.getItem("crol");
  }
  getCompania() {
    return localStorage.getItem("ccompania");
  }

  deleteToken() {
    localStorage.removeItem('user');
    localStorage.removeItem('user');
    localStorage.removeItem("token");
    localStorage.removeItem("ctipo_sistema");
    localStorage.removeItem("cusuario");
    localStorage.removeItem("crol");
    localStorage.removeItem("ccompania");
    
    return 
  }
}
