import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comida } from '../interfaces/comida';

@Injectable({
  providedIn: 'root'
})
export class ComidaService {
  // La URL de tu API de Laravel (Requisito 4)
  private myAppUrl = 'http://127.0.0.1:8000';
  private myApiUrl = '/api/comidas/';

  constructor(private http: HttpClient) { }

  // Listar todos
  getListComidas(): Observable<Comida[]> {
    return this.http.get<Comida[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  // Eliminar
  deleteComida(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  // Guardar 
saveComida(comida: any): Observable<any> {
  return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, comida);
}

  // Ver uno por ID
  getComida(id: number): Observable<Comida> {
    return this.http.get<Comida>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  // Actualizar
  updateComida(id: number, comida: Comida): Observable<void> {
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, comida);
  }
}