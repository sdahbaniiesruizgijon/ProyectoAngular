import { Routes } from '@angular/router';
import { AlimentosApiComponent } from './components/alimentos-api/alimentos-api.component';
import { DiarioComidaComponent } from './components/diario-comida/diario-comida.component';

export const routes: Routes = [
  { path: 'buscar-alimentos', component: AlimentosApiComponent }, 
  { path: 'mi-diario', component: DiarioComidaComponent },       
  { path: '', redirectTo: '/buscar-alimentos', pathMatch: 'full' },
  { path: '**', redirectTo: '/buscar-alimentos', pathMatch: 'full' }
];