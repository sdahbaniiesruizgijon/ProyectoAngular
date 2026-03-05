import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NutricionApiService {
  private baseUrl = 'https://world.openfoodfacts.org/cgi/search.pl';

  constructor(private http: HttpClient) { }

  buscarAlimento(nombre: string): Observable<any> {
    const url = `${this.baseUrl}?search_terms=${nombre}&search_simple=1&action=process&json=1&page_size=5`;
    return this.http.get(url);
  }
}