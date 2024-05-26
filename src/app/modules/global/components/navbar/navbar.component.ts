import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  // Inyectamos dependencias necesarias para el correcto funcionamiento
  constructor(private router: Router) {}
  // Metodo para mostrar la Navbar cuando la url sea diferente a "/"
  ShowNavbar(): boolean {
    return this.router.url !== '/';
  }
  // Inicializacion de la variable IdRol
  idRol: number | null = null;

  ngOnInit(): void {
    // Obtén el id_rol desde el localStorage
    const storedIdRol = localStorage.getItem('idRol');
    if (storedIdRol) {
      this.idRol = parseInt(storedIdRol, 10);
    }
  }
}
