import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NutricionApiService } from '../../services/nutricion-api.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Chart } from 'chart.js/auto'; 
import { ComidaService } from '../../services/comida.service'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

//  Interfaz unificada con los nombres que usas en el HTML
interface Nutrients {
  kcal: number;       
  proteinas: number;  
  carbohidratos: number; 
  grasas: number;     
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
  styleUrl: './alimentos-api.component.scss'
})
export class AlimentosApiComponent implements OnInit {
  @ViewChild('nutrientsChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  busqueda: string = '';
  resultadosBusqueda: AlimentoAPI[] = []; 
  chart: any;
  cargando: boolean = false;

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

    this.cargando = true;
    this.resultadosBusqueda = [];
    this.destruirGrafico();

    this._apiExterna.buscarAlimento(this.busqueda).subscribe({
      next: (data) => {
        setTimeout(() => {
          if (data && data.products) {
            this.resultadosBusqueda = data.products
              .filter((p: any) => p.product_name && p.nutriments) 
              .map((p: any) => ({
                label: p.product_name,
                image: p.image_url || 'https://via.placeholder.com/150', 
                nutrients: {
                  kcal: Math.round(p.nutriments['energy-kcal_100g'] || 0),
                  proteinas: Math.round(p.nutriments.proteins_100g || 0),
                  carbohidratos: Math.round(p.nutriments.carbohydrates_100g || 0),
                  grasas: Math.round(p.nutriments.fat_100g || 0)
                },
                originalData: p
              }));

            if (this.resultadosBusqueda.length > 0) {
              setTimeout(() => {
                this.generarGrafico(this.resultadosBusqueda[0].nutrients);
              }, 100);
            }
          }
          this.cargando = false;
        }, 600);
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  seleccionarAlimento(alimento: AlimentoAPI) {
    this.generarGrafico(alimento.nutrients);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  importarAlDiario(producto: AlimentoAPI) {
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

    // Usamos los datos ya procesados en la interfaz para no liarnos
    const comidaParaGuardar = {
      alimento: producto.label,
      calorias: producto.nutrients.kcal,
      proteinas: producto.nutrients.proteinas,
      carbohidratos: producto.nutrients.carbohidratos,
      grasas: producto.nutrients.grasas,
      fecha: new Date().toISOString().split('T')[0]
    };

    this.http.post('https://ruix.iesruizgijon.es/sedahbani/ProyectoAngular/backend/public/api/comidas', comidaParaGuardar, { headers })
      .subscribe({
        next: () => alert('¡Guardado con éxito!'),
        error: (err) => alert('Error al guardar en el servidor.')
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
          // Usamos los nombres de la interfaz Nutrients
          data: [nutrients.proteinas, nutrients.carbohidratos, nutrients.grasas],
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  destruirGrafico() {
    if (this.chart) { this.chart.destroy(); }
  }
}