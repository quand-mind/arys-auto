import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { CookieService } from "ngx-cookie-service";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private userSubject: BehaviorSubject<null>;    
    public user: Observable<null>;


    constructor(
        private router: Router,
        private http: HttpClient,
        private cookies: CookieService
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(xlogin: string, xcontrasena: string) {
        return this.http.post<any>(environment.apiUrl + '/api/v1/auth/signIn', { xlogin, xcontrasena })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem("token", user.data.token);
                localStorage.setItem("cusuario", user.data.cusuario);
                localStorage.setItem("ctipo_sistema", user.data.ctipo_sistema);
                localStorage.setItem("crol", user.data.crol);
                localStorage.setItem("ccompania", user.data.ccompania);
                this.userSubject.next(user);
                return user;
            }));
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
      localStorage.removeItem("token");
      localStorage.removeItem("ctipo_sistema");
      localStorage.removeItem("cusuario");
      localStorage.removeItem("crol");
      localStorage.removeItem("ccompania");
      return
    }

    logout() {       
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        localStorage.removeItem("token");
        localStorage.removeItem("ctipo_sistema");
        localStorage.removeItem("cusuario");
        localStorage.removeItem("crol");
        localStorage.removeItem("ccompania");
        this.userSubject.next(null);
        this.router.navigate(['/login']);

    }
}