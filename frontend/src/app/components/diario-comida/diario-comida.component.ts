import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ComidaService } from '../../services/comida.service';
import { Comida } from '../../interfaces/comida';
import { RouterModule } from '@angular/router';

// Definición de interfaz local para el alimento en el carrito
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
  templateUrl: './diario-comida.component.html'
})
export class DiarioComidaComponent implements OnInit {
  misDiarios: any[] = []; 
  bibliotecaAlimentos: Comida[] = []; 

  fechaMinima: string = '';
  
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
  }

  cargarDatos(): void {
  // Carga paralela de datos
  this._comidaService.getListDiarios().subscribe({
    next: (data) => {
      // Calculamos los totales para cada diario antes de asignarlo
      this.misDiarios = data.map((diario: any) => {
        const totalCalorias = diario.alimentos.reduce((acc: number, al: any) => {
          // Usamos la relación pivot (cantidad_gramos) y las calorías base del alimento
          return acc + (al.calorias * al.pivot.cantidad_gramos / 100);
        }, 0);

        return {
          ...diario,
          totales: {
            calorias: Math.round(totalCalorias) // Redondeamos para que quede limpio
          }
        };
      });
    },
    error: (e) => console.error('Error al cargar diarios:', e)
  });

  this._comidaService.getListComidas().subscribe({
    next: (data) => this.bibliotecaAlimentos = data,
    error: (e) => console.error('Error al cargar biblioteca:', e)
  });
}

  prepararAlimento(alimento: Comida): void {
    if (!alimento) return;

    // Evitar duplicados: Si ya está, podrías sumar la cantidad en lugar de añadir una fila nueva
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

  guardarAgendaCompleta(): void {
    if (!this.nuevoBlog.titulo || this.nuevoBlog.alimentosSeleccionados.length === 0) {
      alert("Por favor, asigna un título y añade al menos un alimento.");
      return;
    }

    const payload = {
      titulo: this.nuevoBlog.titulo,
      fecha: this.nuevoBlog.fecha,
      descripcion: 'Entrada de diario', 
      // Laravel suele preferir un array simple de IDs o objetos con pivote
      alimentos: this.nuevoBlog.alimentosSeleccionados.map(a => ({
        id: a.id,
        cantidad: a.cantidad
      }))
    };

    this._comidaService.saveDiario(payload).subscribe({
      next: () => {
        alert('¡Diario guardado!');
        this.resetFormulario();
        this.cargarDatos(); 
      },
      error: (err) => {
        console.error('Error en el servidor:', err);
        alert('Error al guardar. Verifica la conexión con el backend.');
      }
    });
  }

  private resetFormulario(): void {
    this.nuevoBlog = { 
      titulo: '', 
      fecha: new Date().toISOString().split('T')[0], 
      alimentosSeleccionados: [] 
    };
  }

  eliminarBlog(id: number): void {
    if(confirm('¿Estás seguro de que deseas eliminar esta entrada?')) {
      this._comidaService.deleteDiario(id).subscribe({
        next: () => this.cargarDatos(),
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

  // Getter para calcular el total de calorías en tiempo real
  get totalKcalPreparadas(): number {
    return this.nuevoBlog.alimentosSeleccionados.reduce((acc, a) => 
      acc + (a.calorias * a.cantidad / 100), 0);
  }
}