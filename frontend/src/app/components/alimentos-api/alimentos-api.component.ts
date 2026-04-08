import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NutricionApiService } from '../../services/nutricion-api.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Chart } from 'chart.js/auto'; 
import { ComidaService } from '../../services/comida.service'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Nutrients {
  ENERC_KCAL: number;
  PROCNT: number;
  CHOCDF: number;
  FAT: number;
}

interface AlimentoAPI {
  label: string;
  image: string; 
  nutrients: Nutrients;
  originalData?: any; 
}

@Component({
  selector: 'app-alimentos-api',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './alimentos-api.component.html',
  styleUrl: './alimentos-api.component.css'
})
export class AlimentosApiComponent implements OnInit {
  @ViewChild('nutrientsChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  busqueda: string = '';
  resultadosBusqueda: AlimentoAPI[] = []; 
  chart: any;

  constructor(
    private _apiExterna: NutricionApiService,
    private _comidaService: ComidaService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {}

  buscar() {
    if (this.busqueda.trim() === '') {
      this.resultadosBusqueda = [];
      return;
    }

    this._apiExterna.buscarAlimento(this.busqueda).subscribe({
      next: (data) => {
        if (data && data.products) {
          this.resultadosBusqueda = data.products
            .filter((p: any) => p.product_name && p.nutriments) 
            .map((p: any) => ({
              label: p.product_name,
              image: p.image_url || 'https://via.placeholder.com/150?text=No+Image', 
              nutrients: {
                ENERC_KCAL: p.nutriments['energy-kcal_100g'] || 0,
                PROCNT: p.nutriments.proteins_100g || 0,
                CHOCDF: p.nutriments.carbohydrates_100g || 0,
                FAT: p.nutriments.fat_100g || 0
              },
              originalData: p
            }));

          if (this.resultadosBusqueda.length > 0) {
            setTimeout(() => {
              this.generarGrafico(this.resultadosBusqueda[0].nutrients);
            }, 150);
          }
        }
      },
      error: (err) => console.error(err)
    });
  }

  seleccionarAlimento(alimento: AlimentoAPI) {
    this.generarGrafico(alimento.nutrients);
  }

  importarAlDiario(producto: any) {
    const token = localStorage.getItem('token'); 
    if (!token) {
      alert('Sesión no válida. Por favor, inicia sesión de nuevo.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const p = producto.originalData ? producto.originalData : producto;
    const comidaParaGuardar = {
      alimento: p.product_name || producto.label || 'Sin nombre',
      calorias: Math.round(p.nutriments?.['energy-kcal_100g'] || producto.nutrients?.ENERC_KCAL || 0),
      proteinas: Math.round(p.nutriments?.proteins_100g || producto.nutrients?.PROCNT || 0),
      carbohidratos: Math.round(p.nutriments?.carbohydrates_100g || producto.nutrients?.CHOCDF || 0),
      grasas: Math.round(p.nutriments?.fat_100g || producto.nutrients?.FAT || 0),
      fecha: new Date().toISOString().split('T')[0]
    };

    this.http.post('https://ruix.iesruizgijon.es/sedahbani/ProyectoAngular/backend/public/api/comidas', comidaParaGuardar, { headers })
      .subscribe({
        next: () => alert('¡Guardado con éxito!'),
        error: (err) => {
          console.error(err);
          alert('Error al guardar en el servidor.');
        }
      });
  }

  generarGrafico(nutrients: Nutrients) {
    this.destruirGrafico(); 

    if (!this.chartCanvas) return;
    const ctx = this.chartCanvas.nativeElement;

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Proteínas (g)', 'Carbohidratos (g)', 'Grasas (g)'],
        datasets: [{
          data: [nutrients.PROCNT, nutrients.CHOCDF, nutrients.FAT],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: `Macronutrientes` }
        }
      }
    });
  }

  destruirGrafico() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}