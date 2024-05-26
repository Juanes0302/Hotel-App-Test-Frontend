import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  // Declaramos las columnas que vamos utilizar e inicializamos variables
  displayedColumns: string[] = [
    'record_fullname',
    'record_dni',
    'record_phone_number',
    'record_admission_date',
    'record_departure_date',
    'record_room',
    'id_guest',
    'id_room',
    'menu',
  ];
  dataSource = new MatTableDataSource<any>([]);
  recordData: any;
  // accedemosa una instancia del paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // Inyectamos dependencias necesarias para el correcto funcionamiento
  constructor(private httpService: HttpService, public dialog: MatDialog) {}
  // Inicializamos la tabla en el ngOnInit
  ngOnInit(): void {
    this.LeerTodoR();
  }
  // Metodo para asignar al dataSource todas los registros
  LeerTodoR() {
    this.httpService.LeerTodoR().subscribe((respuesta) => {
      this.dataSource = new MatTableDataSource<any>(respuesta);
      this.dataSource.paginator = this.paginator;
    });
  }
  // Metodo para Filtrar por medio del input Search
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // Metodo para eliminar un registro
  EliminarR(id_record: number) {
    let confirmacion = confirm(
      '¿Está seguro de que desea eliminar este registro?'
    );
    if (confirmacion) {
      this.httpService.EliminarR(id_record).subscribe(
        () => {
          alert('Registro eliminado correctamente');
          this.LeerTodoR();
        },
        (error) => {
          console.error('Error al eliminar el registro:', error);
        }
      );
    }
  }
}
