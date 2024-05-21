import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  idRol: number | null = null;

  ngOnInit(): void {
    // Obtén el id_rol desde el localStorage
    const storedIdRol = localStorage.getItem('idRol');
    if (storedIdRol) {
      this.idRol = parseInt(storedIdRol, 10);
    }
  }
}
