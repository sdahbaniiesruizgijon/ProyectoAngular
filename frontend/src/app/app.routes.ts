import { Routes } from '@angular/router';
import { AlimentosApiComponent } from './components/alimentos-api/alimentos-api.component';
import { DiarioComidaComponent } from './components/diario-comida/diario-comida.component';
import { PropositoComponent } from './components/proposito/proposito.component';
import { EditarComponent } from './components/editar/editar.component';

export const routes: Routes = [
  { path: 'buscar-alimentos', component: AlimentosApiComponent },
  { path: 'mi-diario', component: DiarioComidaComponent },
  { path: 'proposito', component: PropositoComponent },
  { path: 'editar/:id', component: EditarComponent },
  { path: '', redirectTo: '/buscar-alimentos', pathMatch: 'full' }
];