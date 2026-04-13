import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comida } from '../interfaces/comida';

@Injectable({
  providedIn: 'root'
})
export class ComidaService {
  private myAppUrl = 'https://ruix.iesruizgijon.es/sedahbani/ProyectoAngular/backend/public';
  private apiComidas = '/api/comidas';
  private apiDiarios = '/api/diarios'; 

  constructor(private http: HttpClient) { }

  // 1. Creador de cabeceras dinámico con Token
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ==========================================
  //          MÉTODOS DE COMIDAS
  // ==========================================

  getListComidas(): Observable<Comida[]> {
    return this.http.get<Comida[]>(`${this.myAppUrl}${this.apiComidas}`, { headers: this.getHeaders() });
  }

  getComida(id: number): Observable<Comida> {
    return this.http.get<Comida>(`${this.myAppUrl}${this.apiComidas}/${id}`, { headers: this.getHeaders() });
  }

  buscarAlimentos(termino: string): Observable<Comida[]> {
    return this.http.get<Comida[]>(`${this.myAppUrl}${this.apiComidas}?buscar=${termino}`, { headers: this.getHeaders() });
  }

  saveComida(comida: any): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.apiComidas}`, comida, { headers: this.getHeaders() });
  }

  updateComida(id: number, comida: Comida): Observable<void> {
    return this.http.put<void>(`${this.myAppUrl}${this.apiComidas}/${id}`, comida, { headers: this.getHeaders() });
  }

  deleteComida(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.apiComidas}/${id}`, { headers: this.getHeaders() });
  }

  // ==========================================
  //          MÉTODOS DE DIARIOS
  // ==========================================

  getListDiarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.myAppUrl}${this.apiDiarios}`, { headers: this.getHeaders() });
  }

  saveDiario(diario: any): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.apiDiarios}`, diario, { headers: this.getHeaders() });
  }

  updateDiario(id: number, diario: any): Observable<any> {
    return this.http.put(`${this.myAppUrl}${this.apiDiarios}${id}`, diario, { headers: this.getHeaders() });
  }

  deleteDiario(id: number): Observable<any> {
    return this.http.delete(`${this.myAppUrl}${this.apiDiarios}${id}`, { headers: this.getHeaders() });
  }
}