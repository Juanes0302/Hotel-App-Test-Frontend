import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/http.service';
import { FormComponent } from '../form/form.component';
import { FormEditComponent } from '../../components/form-edit/form-edit.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  // Declaramos las columnas que vamos utilizar e inicializamos variables
  displayedColumns: string[] = ['email', 'password', 'id_rol', 'menu'];

  dataSource = new MatTableDataSource<any>([]);
  userData: any;
  // Inyectamos dependencias necesarias para el correcto funcionamiento
  constructor(private httpService: HttpService, public dialog: MatDialog) {}
  // Inicializamos la tabla en el ngOnInit
  ngOnInit(): void {
    this.LeerTodoU();
  }
  // Metodo para asignar al dataSource todas los usuarios
  LeerTodoU() {
    this.httpService.LeerTodoU().subscribe((respuesta) => {
      console.log(respuesta);
      this.dataSource.data = respuesta;
    });
  }
  // Metodo para obtener el Nombre del Rol
  getRolName(idRol: number): string {
    if (idRol === 1) {
      return 'Employee';
    } else if (idRol === 2) {
      return 'Admin';
    } else {
      return 'Unknown';
    }
  }
  // Metodo para inicializar la modal para crear un nuevo usuario
  crearUser() {
    const dialogRef = this.dialog.open(FormComponent, {
      disableClose: true,
      autoFocus: true,
      closeOnNavigation: false,
      position: { top: '30px' },
      width: '700px',
      data: {
        tipo: 'CREAR',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.LeerTodoU();
    });
  }
  // Metodo para Eliminar un usuario
  eliminarU(id: number) {
    let confirmacion = confirm(
      '¿Está seguro de que desea eliminar este usuario?'
    );
    if (confirmacion) {
      this.httpService.EliminarU(id).subscribe(
        () => {
          alert('Usuario eliminado correctamente');
          this.LeerTodoU();
        },
        (error) => {
          console.error('Error al eliminar el Usuario:', error);
          console.log(id);
        }
      );
    }
  }
  // Metodo para Editar una usuario
  editarU(id: number) {
    const user = this.dataSource.data.find((user) => user.id === id);
    if (user) {
      this.userData = user;
      const dialogRef = this.dialog.open(FormEditComponent, {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '700px',
        data: {
          userData: this.userData,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.LeerTodoU();
      });
    } else {
      console.error(
        'No se pudo encontrar la habitación con el ID especificado.'
      );
    }
  }
}
