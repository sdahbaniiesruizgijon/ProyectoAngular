import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NutricionApiService } from '../../services/nutricion-api.service';
import { Chart, registerables } from 'chart.js';
import { ComidaService } from '../../services/comida.service';

Chart.register(...registerables);

@Component({
  selector: 'app-alimentos-api',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alimentos-api.component.html'
})
export class AlimentosApiComponent {
  busqueda: string = '';
  alimentoEncontrado: any = null;
  chart: any;

  @ViewChild('myChart') chartCanvas!: ElementRef;


  constructor(private _apiExterna: NutricionApiService, private _comidaService: ComidaService) {}

  guardarEnDiario() {
  const nueva: any = {
    alimento: this.alimentoEncontrado.label,
    calorias: Math.round(this.alimentoEncontrado.nutrients.ENERC_KCAL),
    proteinas: this.alimentoEncontrado.nutrients.PROCNT,
    carbohidratos: this.alimentoEncontrado.nutrients.CHOCDF,
    grasas: this.alimentoEncontrado.nutrients.FAT,
    fecha: new Date().toISOString().split('T')[0] // Fecha de hoy
  };

  this._comidaService.saveComida(nueva).subscribe(() => {
    alert('¡Alimento guardado en tu diario de Laravel!');
  });
}

  buscar() {
    if (this.busqueda.trim() === '') return;

    this._apiExterna.buscarAlimento(this.busqueda).subscribe(data => {
      if (data.hints && data.hints.length > 0) {
        this.alimentoEncontrado = data.hints[0].food;
        this.generarGrafico(this.alimentoEncontrado.nutrients);
      }
    });
  }

  generarGrafico(nutrientes: any) {
    if (this.chart) {
      this.chart.destroy(); // Borrar gráfico anterior si existe
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'pie', // Gráfico de tarta (Requisito 3.2)
      data: {
        labels: ['Proteínas', 'Carbohidratos', 'Grasas'],
        datasets: [{
          data: [nutrientes.PROCNT, nutrientes.CHOCDF, nutrientes.FAT],
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}