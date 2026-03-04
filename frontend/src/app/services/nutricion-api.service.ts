import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NutricionApiService {
  private appId = 'TU_APP_ID'; 
  private appKey = 'TU_APP_KEY';
  private urlApi = 'https://api.edamam.com/api/food-database/v2/parser';

  constructor(private http: HttpClient) { }

  buscarAlimento(nombre: string): Observable<any> {
    const url = `${this.urlApi}?app_id=${this.appId}&app_key=${this.appKey}&ingr=${nombre}&nutrition-type=logging`;
    return this.http.get<any>(url);
  }
}