import { Component, OnInit } from '@angular/core';
import { NutricionApiService } from '../../services/nutricion-api.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Chart } from 'chart.js/auto'; 
import { ComidaService } from '../../services/comida.service'; // <--- IMPORTAMOS EL SERVICIO DE LARAVEL

interface Nutrients {
  ENERC_KCAL: number;
  PROCNT: number;
  CHOCDF: number;
  FAT: number;
}

interface AlimentoAPI {
  label: string;
  image: string; // Para la imagen
  nutrients: Nutrients;
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
    private _comidaService: ComidaService 
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
          }
        }));

      if (this.resultadosBusqueda.length > 0) {
        this.generarGrafico(this.resultadosBusqueda[0].nutrients);
      } else {
        this.destruirGrafico();
      }
    });
  }


  importarAlDiario(alimento: any) {
    const nueva: any = {
      alimento: alimento.label,
      calorias: Math.round(alimento.nutrients.ENERC_KCAL),
      proteinas: alimento.nutrients.PROCNT || 0,
      carbohidratos: alimento.nutrients.CHOCDF || 0,
      grasas: alimento.nutrients.FAT || 0,
      fecha: new Date().toISOString().split('T')[0]
    };

    this._comidaService.saveComida(nueva).subscribe({
      next: (res: any) => {
        alert(`¡"${alimento.label}" guardado en Laravel!`);
        console.log('Respuesta:', res);
        
      },
      error: (err: any) => {
        console.error('Error:', err);
        alert('Error al conectar con el servidor');
      }
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
            'rgba(255, 99, 132, 0.8)', // Proteínas (Rojo)
            'rgba(54, 162, 235, 0.8)', // Carbohidratos (Azul)
            'rgba(255, 206, 86, 0.8)'  // Grasas (Amarillo)
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
            text: `Macronutrientes: ${this.resultadosBusqueda[0]?.label || 'Alimento'}`
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