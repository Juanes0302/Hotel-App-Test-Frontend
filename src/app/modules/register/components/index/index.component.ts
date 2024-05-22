import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/http.service';
import { FormComponent } from '../form/form.component';
import { FormEditComponent } from '../../form-edit/form-edit.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  displayedColumns: string[] = [
    'email',
    'password',
    'id_rol',
    'menu',
  ];

  dataSource = new MatTableDataSource<any>([]);
  userData: any;
  constructor(private httpService: HttpService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.LeerTodoU();
  }

  LeerTodoU() {
    this.httpService.LeerTodoU().subscribe((respuesta) => {
      console.log(respuesta);
      this.dataSource.data = respuesta;
    });
  }
  getRolName(idRol: number): string {
    if (idRol === 1) {
      return 'Employee';
    } else if (idRol === 2) {
      return 'Admin';
    } else {
      return 'Unknown';
    }
  }
  crearUser() {
    const dialogRef = this.dialog.open(FormComponent, {
      disableClose: true,
      autoFocus: true,
      closeOnNavigation: false,
      position: { top: '30px'},
      width: '700px',
      data: {
        tipo: 'CREAR'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.LeerTodoU();
    });
  }
  eliminarU(id: number) {
    let confirmacion = confirm('¿Está seguro de que desea eliminar este usuario?');
    if (confirmacion) {
      this.httpService.EliminarU(id)
        .subscribe(
          () => {
            alert('Usuario eliminado correctamente');
            this.LeerTodoU();
          },
          (error) => {
            console.error('Error al eliminar el Usuario:', error);
            console.log(id)
          }
        );
    }
  }
  editarU(id: number) {
    const user = this.dataSource.data.find(user => user.id === id);
    if (user) {
      this.userData = user;
      const dialogRef = this.dialog.open(FormEditComponent, {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px'},
        width: '700px',
        data: {
          userData: this.userData
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.LeerTodoU();
      });
    } else {
      console.error('No se pudo encontrar la habitación con el ID especificado.');
    }
  }
}
