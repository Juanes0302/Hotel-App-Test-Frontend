import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router) {}

  shouldShowNavbar(): boolean {
    return this.router.url !== '/';
  }
  idRol: number | null = null;

  ngOnInit(): void {
    // Obtén el id_rol desde el localStorage
    const storedIdRol = localStorage.getItem('idRol');
    if (storedIdRol) {
      this.idRol = parseInt(storedIdRol, 10);
    }
  }
}
