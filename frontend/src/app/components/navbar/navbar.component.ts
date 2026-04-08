import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class AppNavbarComponent { 

  // Cambiamos a 'public' para que el HTML pueda acceder a sus métodos como estaLogueado()
  constructor(public authService: AuthService, private router: Router) {}

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        // Aun si falla el servidor, forzamos la navegación al login
        this.router.navigate(['/login']);
      }
    });
  }
}