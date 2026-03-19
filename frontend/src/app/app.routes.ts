import { Routes } from '@angular/router';
import { AlimentosApiComponent } from './components/alimentos-api/alimentos-api.component';
import { authGuard } from './guards/auth.guard';
import { DiarioComidaComponent } from './components/diario-comida/diario-comida.component';
import { PropositoComponent } from './components/proposito/proposito.component';
import { EditarComponent } from './components/editar/editar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: 'buscar-alimentos', component: AlimentosApiComponent, canActivate: [authGuard] },
  { path: 'mi-diario', component: DiarioComidaComponent, canActivate: [authGuard] },
  { path: 'proposito', component: PropositoComponent, canActivate: [authGuard] },
  { path: 'editar/:id', component: EditarComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];