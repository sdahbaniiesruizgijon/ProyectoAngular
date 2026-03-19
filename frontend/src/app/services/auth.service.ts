import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap((res: any) => this.setSession(res))
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => this.setSession(res))
    );
  }

  private setSession(res: any) {
    localStorage.setItem('token', res.access_token);
    localStorage.setItem('user_name', res.user.name);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
  }

 estaLogueado(): boolean {
  const token = localStorage.getItem('token');
  return token !== null && token !== undefined && token !== '';
}
}