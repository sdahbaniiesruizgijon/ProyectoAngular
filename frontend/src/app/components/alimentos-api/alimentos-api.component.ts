import { Component, OnInit } from '@angular/core';
import { NutricionApiService } from '../../services/nutricion-api.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Chart } from 'chart.js/auto'; 
import { ComidaService } from '../../services/comida.service'; 
import { HttpClient } from '@angular/common/http';

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
  busqueda: string = '';
  resultadosBusqueda: AlimentoAPI[] = []; 
  chart: any;

  constructor(
    private _apiExterna: NutricionApiService,
    private _comidaService: ComidaService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  buscar() {
    if (this.busqueda.trim() === '') {
      this.resultadosBusqueda = [];
      return;
    }

    this._apiExterna.buscarAlimento(this.busqueda).subscribe(data => {
      console.log(data); 

      this.resultadosBusqueda = data.products
        .filter((p: any) => p.product_name && p.nutriments['energy-kcal_100g']) 
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
        this.generarGrafico(this.resultadosBusqueda[0].nutrients);
      } else {
        this.destruirGrafico();
      }
    });
  }

  seleccionarAlimento(alimento: AlimentoAPI) {
    this.generarGrafico(alimento.nutrients);
  }

  importarAlDiario(producto: any) {
    const p = producto.originalData ? producto.originalData : producto;
    
    const comidaParaGuardar = {
      alimento: p.product_name || producto.label || 'Sin nombre',
      calorias: p.nutriments?.['energy-kcal_100g'] || producto.nutrients?.ENERC_KCAL || 0,
      proteinas: p.nutriments?.proteins_100g || producto.nutrients?.PROCNT || 0,
      carbohidratos: p.nutriments?.carbohydrates_100g || producto.nutrients?.CHOCDF || 0,
      grasas: p.nutriments?.fat_100g || producto.nutrients?.FAT || 0
    };

    this.http.post('http://127.0.0.1:8000/api/comidas', comidaParaGuardar)
      .subscribe({
        next: (res) => alert('¡Alimento importado con éxito!'),
        error: (err) => console.error('Error detallado:', err)
      });
  }

  cargarAlimentosDesdeDB() {
    console.log('Alimento guardado. Lista actualizada en segundo plano.');
  }

  generarGrafico(nutrients: Nutrients) {
    this.destruirGrafico(); 

    const ctx = document.getElementById('nutrientsChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Proteínas (g)', 'Carbohidratos (g)', 'Grasas (g)'],
        datasets: [{
          data: [
            nutrients.PROCNT,
            nutrients.CHOCDF,
            nutrients.FAT
          ],
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
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: `Macronutrientes`
          }
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