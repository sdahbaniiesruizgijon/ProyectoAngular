import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importante para el formulario
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
  nuevaComida: Comida = { alimento: '', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0, fecha: '' };

  constructor(private _comidaService: ComidaService) {}

  ngOnInit(): void {
    this.obtenerComidas();
  }

  obtenerComidas() {
    this._comidaService.getListComidas().subscribe(data => {
      this.listComidas = data;
    });
  }

  agregarComida() {
    this._comidaService.saveComida(this.nuevaComida).subscribe(() => {
      this.obtenerComidas(); // Refresca la tabla
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
}