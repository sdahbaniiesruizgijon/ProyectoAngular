import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Añadimos Router
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class AppNavbarComponent { 

  // Inyectamos el servicio y el router
  constructor(private authService: AuthService, private router: Router) {}

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }

  // Método para el botón de cerrar sesión
  onLogout() {
    this.authService.logout(); // Llama al método que borra el token
    this.router.navigate(['/login']); // Te manda al login
  }

}