import { Component, OnInit } from '@angular/core'; // Añadimos OnInit
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss' // Recuerda cambiar esto a .scss si renombraste el archivo
})
export class AppNavbarComponent implements OnInit { 

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Al cargar el componente, verificamos si el usuario ya tenía el modo oscuro activado
    const darkModeSaved = localStorage.getItem('theme') === 'dark';
    if (darkModeSaved) {
      document.body.classList.add('dark-mode');
    }
  }

  toggleDarkMode() {
    // Alternamos la clase en el body
    const isDark = document.body.classList.toggle('dark-mode');
    
    // Guardamos la preferencia para que no se pierda al navegar o recargar
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        // Aun si falla el servidor, limpiamos el estado local y redirigimos
        this.router.navigate(['/login']);
      }
    });
  }
}