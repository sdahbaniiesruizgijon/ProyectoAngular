import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NutricionApiService {
  // Ahora la URL apunta a tu propio Backend (Laravel)
  private baseUrl = 'https://ruix.iesruizgijon.es/sedahbani/ProyectoAngular/backend/public/api/buscar-alimento';

  constructor(private http: HttpClient) { }

  buscarAlimento(nombre: string): Observable<any> {
    // Laravel se encargará de añadir todos los parámetros (json=1, action=process, etc.)
    // Nosotros solo le enviamos el término de búsqueda 'q'
    const url = `${this.baseUrl}?q=${nombre}`;
    return this.http.get(url);
  }
}