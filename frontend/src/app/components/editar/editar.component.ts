import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComidaService } from '../../services/comida.service';
import { Comida } from '../../interfaces/comida';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar.component.html'
})
export class EditarComponent implements OnInit {
  id: number = 0;
  comida: Comida = { 
    alimento: '', 
    calorias: 0, 
    proteinas: 0, 
    carbohidratos: 0, 
    grasas: 0, 
    fecha: '' 
  };

  constructor(
    private _comidaService: ComidaService,
    private router: Router,
    private aRoute: ActivatedRoute
  ) {
    this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (this.id !== 0) {
      this.obtenerComida();
    }
  }

  obtenerComida() {
    this._comidaService.getComida(this.id).subscribe({
      next: (data) => {
        this.comida = data;
      },
      error: (e) => console.error(e)
    });
  }

  actualizarComida() {
    this._comidaService.updateComida(this.id, this.comida).subscribe({
      next: () => {
        // Redirigir a la lista principal tras editar
        this.router.navigate(['/']); 
      },
      error: (e) => console.error(e)
    });
  }

  cancelar() {
    this.router.navigate(['/']);
  }
}