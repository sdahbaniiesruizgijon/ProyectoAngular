import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ComidaService } from '../../services/comida.service';
import { Comida } from '../../interfaces/comida';

@Component({
  selector: 'app-diario-comida',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diario-comida.component.html'
})
export class DiarioComidaComponent implements OnInit {
  listComidas: Comida[] = [];
  listComidasFiltradas: Comida[] = []; 
  
  nuevaComida: Comida = { alimento: '', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, fecha: '' };

  constructor(private _comidaService: ComidaService) {}

  ngOnInit(): void {
    this.obtenerComidas();
  }


obtenerComidas() {
  this._comidaService.getListComidas().subscribe({
    next: (data) => {
      this.listComidas = data;
      this.listComidasFiltradas = data;
    },
    error: (e) => console.error(e)
  });
}

  filtrarComidas(event: any) {
  const valor = event.target.value.toLowerCase().trim();

  if (valor === '') {
    this.listComidasFiltradas = this.listComidas; 
  } else {
    this.listComidasFiltradas = this.listComidas.filter(comida => 
      comida.alimento.toLowerCase().includes(valor)
    );
  }
}

  agregarComida() {
    this._comidaService.saveComida(this.nuevaComida).subscribe(() => {
      this.obtenerComidas(); 
      this.limpiarFormulario();
    });
  }

  eliminarComida(id: any) {
    this._comidaService.deleteComida(id).subscribe(() => {
      this.obtenerComidas();
    });
  }

  limpiarFormulario() {
    this.nuevaComida = { alimento: '', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, fecha: '' };
  }

  get totalCalorias(): number {
    return this.listComidas.reduce((acc, obj) => acc + obj.calorias, 0);
  }

  get porcentajeProgreso(): number {
    const meta = 2000; 
    const porcentaje = (this.totalCalorias / meta) * 100;
    return porcentaje > 100 ? 100 : porcentaje;
  }
}