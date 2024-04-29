import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/http.service';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  displayedColumns: string[] = [
    'room_identity',
    'room_type',
    'bedroom_numbers',
    'bed_numbers',
    'number_bathrooms',
    'status',
    'menu',
  ];
  dataSource = new MatTableDataSource<any>([]);

  constructor(private httpService: HttpService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.LeerTodo();
  }

  LeerTodo() {
    this.httpService.LeerTodo().subscribe((respuesta) => {
      console.log(respuesta);
      this.dataSource.data = respuesta;
    });
  }

  crearRoom() {
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
    });
  }
  eliminar(id_room: number) {
    let confirmacion = confirm('¿Está seguro de que desea eliminar este elemento?');
    if (confirmacion) {
      this.httpService.Eliminar(id_room)
        .subscribe(
          () => {
            console.log('Elemento eliminado correctamente');
            this.LeerTodo();
          },
          (error) => {
            console.error('Error al eliminar el elemento:', error);
          }
        );
    }
  }
}
