import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comida } from '../interfaces/comida';

@Injectable({
  providedIn: 'root'
})
export class ComidaService {
  private myAppUrl = 'http://127.0.0.1:8000';
  private apiComidas = '/api/comidas/';
  private apiDiarios = '/api/diarios/'; 

  constructor(private http: HttpClient) { }


  getListComidas(): Observable<Comida[]> {
    return this.http.get<Comida[]>(`${this.myAppUrl}${this.apiComidas}`);
  }

  buscarAlimentos(termino: string): Observable<Comida[]> {
    return this.http.get<Comida[]>(`${this.myAppUrl}${this.apiComidas}?buscar=${termino}`);
  }

  deleteComida(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.apiComidas}${id}`);
  }

  saveComida(comida: any): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.apiComidas}`, comida);
  }

  getComida(id: number): Observable<Comida> {
    return this.http.get<Comida>(`${this.myAppUrl}${this.apiComidas}${id}`);
  }

  updateComida(id: number, comida: Comida): Observable<void> {
    return this.http.put<void>(`${this.myAppUrl}${this.apiComidas}${id}`, comida);
  }


  // Obtener todos los blogs guardados
  getListDiarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.myAppUrl}${this.apiDiarios}`);
  }

  saveDiario(diario: any): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.apiDiarios}`, diario);
  }

  // Eliminar un blog completo
  deleteDiario(id: number): Observable<any> {
    return this.http.delete(`${this.myAppUrl}${this.apiDiarios}${id}`);
  }
}