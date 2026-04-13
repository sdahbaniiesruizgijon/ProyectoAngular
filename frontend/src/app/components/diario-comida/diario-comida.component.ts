import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ComidaService } from '../../services/comida.service';
import { Comida } from '../../interfaces/comida';
import { RouterModule } from '@angular/router';

interface AlimentoSeleccionado {
  id: number;
  nombre: string;
  calorias: number;
  cantidad: number;
}

@Component({
  selector: 'app-diario-comida',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './diario-comida.component.html',
  styleUrls: ['./diario-comida.component.scss']
})
export class DiarioComidaComponent implements OnInit {
  misDiarios: any[] = []; 
  bibliotecaAlimentos: Comida[] = []; 
  fechaMinima: string = '';
  editandoId: number | null = null; // Rastrear si estamos editando
  
  nuevoBlog = {
    titulo: '',
    fecha: new Date().toISOString().split('T')[0],
    alimentosSeleccionados: [] as AlimentoSeleccionado[]
  };

  constructor(private _comidaService: ComidaService) {
    this.fechaMinima = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.cargarBiblioteca();
  }

  cargarBiblioteca(): void {
    this._comidaService.getListComidas().subscribe({
      next: (data) => this.bibliotecaAlimentos = data
    });
  }

  cargarDatos(): void {
    this._comidaService.getListDiarios().subscribe({
      next: (res: any) => {
        const datos = Array.isArray(res) ? res : (res.data || []);
        this.misDiarios = datos.map((d: any) => ({
          ...d,
          caloriasTotales: d.totales?.calorias || 0
        }));
      }
    });
  }

  prepararAlimento(alimento: Comida): void {
    if (!alimento) return;
    const existe = this.nuevoBlog.alimentosSeleccionados.find(a => a.id === alimento.id);
    if (existe) {
      existe.cantidad += 100;
    } else {
      this.nuevoBlog.alimentosSeleccionados.push({
        id: alimento.id!,
        nombre: alimento.alimento,
        calorias: alimento.calorias,
        cantidad: 100 
      });
    }
  }

  quitarAlimentoPreparado(index: number): void {
    this.nuevoBlog.alimentosSeleccionados.splice(index, 1);
  }

  // Carga los datos en el formulario
  editarBlog(diario: any): void {
    this.editandoId = diario.id;
    this.nuevoBlog = {
      titulo: diario.titulo,
      fecha: diario.fecha,
      alimentosSeleccionados: diario.alimentos.map((al: any) => ({
        id: al.id,
        nombre: al.alimento,
        calorias: al.calorias,
        cantidad: al.pivot?.cantidad_gramos || 100
      }))
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion(): void {
    this.resetFormulario();
    this.editandoId = null;
  }

  guardarAgendaCompleta(): void {
    if (!this.nuevoBlog.titulo || this.nuevoBlog.alimentosSeleccionados.length === 0) {
      alert("Por favor, asigna un título y añade al menos un alimento.");
      return;
    }

    const alimentosPivot: any = {};
    this.nuevoBlog.alimentosSeleccionados.forEach(a => {
      alimentosPivot[a.id] = { cantidad_gramos: a.cantidad };
    });

    const payload = {
      titulo: this.nuevoBlog.titulo,
      fecha: this.nuevoBlog.fecha,
      descripcion: 'Entrada de diario',
      alimentos: alimentosPivot 
    };

    if (this.editandoId) {
      this._comidaService.updateDiario(this.editandoId, payload).subscribe({
        next: () => {
          alert('¡Diario actualizado!');
          this.finalizarAccion();
        }
      });
    } else {
      this._comidaService.saveDiario(payload).subscribe({
        next: () => {
          alert('¡Diario guardado!');
          this.finalizarAccion();
        }
      });
    }
  }

  private finalizarAccion(): void {
    this.resetFormulario();
    this.editandoId = null;
    setTimeout(() => this.cargarDatos(), 500);
  }

  private resetFormulario(): void {
    this.nuevoBlog = { 
      titulo: '', 
      fecha: new Date().toISOString().split('T')[0], 
      alimentosSeleccionados: [] 
    };
  }

  eliminarBlog(id: number): void {
    if(confirm('¿Estás seguro?')) {
      this._comidaService.deleteDiario(id).subscribe({
        next: () => this.cargarDatos()
      });
    }
  }

  get totalKcalPreparadas(): number {
    return this.nuevoBlog.alimentosSeleccionados.reduce((acc, a) => 
      acc + (a.calorias * a.cantidad / 100), 0);
  }
}