import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ComidaService } from '../../services/comida.service';
import { Comida } from '../../interfaces/comida';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-diario-comida',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './diario-comida.component.html'
})
export class DiarioComidaComponent implements OnInit {
  misDiarios: any[] = []; 
  bibliotecaAlimentos: Comida[] = []; 
  
  nuevoBlog = {
    titulo: '',
    fecha: new Date().toISOString().split('T')[0],
    alimentosSeleccionados: [] as any[]
  };

  constructor(private _comidaService: ComidaService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this._comidaService.getListDiarios().subscribe({
      next: (data) => this.misDiarios = data,
      error: (e) => console.error('Error al cargar diarios:', e)
    });
    this._comidaService.getListComidas().subscribe({
      next: (data) => this.bibliotecaAlimentos = data,
      error: (e) => console.error('Error al cargar biblioteca:', e)
    });
  }

  prepararAlimento(alimento: any) {
    if (!alimento) return;
    this.nuevoBlog.alimentosSeleccionados.push({
      id: alimento.id,
      nombre: alimento.alimento,
      calorias: alimento.calorias,
      cantidad: 100 
    });
  }

  quitarAlimentoPreparado(index: number) {
    this.nuevoBlog.alimentosSeleccionados.splice(index, 1);
  }

  guardarAgendaCompleta() {
    if (!this.nuevoBlog.titulo || this.nuevoBlog.alimentosSeleccionados.length === 0) {
      alert("Faltan datos para publicar el blog");
      return;
    }

    const payload = {
      titulo: this.nuevoBlog.titulo,
      fecha: this.nuevoBlog.fecha,
      descripcion: '', // Importante para evitar error 500 en BD
      alimentos: this.nuevoBlog.alimentosSeleccionados.map(a => ({
        id: a.id,
        cantidad: a.cantidad
      }))
    };

    this._comidaService.saveDiario(payload).subscribe({
      next: () => {
        alert('¡Blog de comida guardado con éxito!');
        this.nuevoBlog = { 
          titulo: '', 
          fecha: new Date().toISOString().split('T')[0], 
          alimentosSeleccionados: [] 
        };
        this.cargarDatos(); 
      },
      error: (err) => {
        console.error('Error POST:', err);
        alert('Error al guardar: revisa la consola de Laravel');
      }
    });
  }

  eliminarBlog(id: number) {
    if(confirm('¿Eliminar esta entrada del diario?')) {
      this._comidaService.deleteDiario(id).subscribe(() => this.cargarDatos());
    }
  }

  get totalKcalPreparadas(): number {
    return this.nuevoBlog.alimentosSeleccionados.reduce((acc, a) => 
      acc + (Number(a.calorias) * Number(a.cantidad) / 100), 0);
  }
}