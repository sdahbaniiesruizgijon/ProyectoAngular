import { Routes } from '@angular/router';
import { AlimentosApiComponent } from './components/alimentos-api/alimentos-api.component';
import { authGuard } from './guards/auth.guard';
import { DiarioComidaComponent } from './components/diario-comida/diario-comida.component';
import { PropositoComponent } from './components/proposito/proposito.component';
import { EditarComponent } from './components/editar/editar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  // 1. Quitamos el guard de 'proposito' para que sea público
  { path: 'proposito', component: PropositoComponent }, 

  // 2. La ruta inicial ahora carga 'proposito' en lugar de redirigir al login
  { path: '', component: PropositoComponent, pathMatch: 'full' },

  // 3. Rutas de acceso
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 4. Rutas protegidas (solo para usuarios logueados)
  { path: 'buscar-alimentos', component: AlimentosApiComponent, canActivate: [authGuard] },
  { path: 'mi-diario', component: DiarioComidaComponent, canActivate: [authGuard] },
  { path: 'editar/:id', component: EditarComponent, canActivate: [authGuard] },

  // 5. Comodín: si escriben cualquier cosa mal, los mandamos a propósito o login
  { path: '**', redirectTo: '' }
];