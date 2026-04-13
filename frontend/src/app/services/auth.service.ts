import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
//https://ruix.iesruizgijon.es/sedahbani/ProyectoAngular/backend/public/api
  // Opción recomendada: Añade la barra al final de la base
private apiUrl = 'https://ruix.iesruizgijon.es/sedahbani/ProyectoAngular/backend/public/api';

  constructor(private http: HttpClient) {}

  // Centralizamos los headers para no repetir código
  private getStandardHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, { headers: this.getStandardHeaders() }).pipe(
      tap((res: any) => this.setSession(res))
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { headers: this.getStandardHeaders() }).pipe(
      tap((res: any) => this.setSession(res))
    );
  }

  private setSession(res: any) {
    // Solo guardamos si el token existe en la respuesta
    if (res && res.access_token) {
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('user_name', res.user.name);
    }
  }

  logout(): Observable<any> {
    const token = this.getToken();
    
    // Para el logout es OBLIGATORIO enviar el token en el header, 
    // de lo contrario Laravel no sabe a quién desloguear.
    const headers = this.getStandardHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap({
        next: () => this.clearSession(),
        error: () => this.clearSession() // Si falla el servidor, igual borramos lo local
      })
    );
  }

  private clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserName(): string | null {
    return localStorage.getItem('user_name');
  }
}