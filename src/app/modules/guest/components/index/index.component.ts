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
    'guest_fullname',
    'guest_dni',
    'guest_phone_number',
    'admission_date',
    'departure_date',
    'id_room',
    'menu',
  ];
  dataSource = new MatTableDataSource<any>([]);
  guestData: any;

  constructor(private httpService: HttpService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.LeerTodoG();
  }

  LeerTodoG(){
    this.httpService.LeerTodoG().subscribe((respuesta) => {
      console.log(respuesta);
      this.dataSource.data = respuesta;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  crearGuest(){
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
      this.LeerTodoG();
    });
  }
  eliminarG(id_guest: number) {
    let confirmacion = confirm('¿Está seguro de que desea eliminar este usuario?');
    if (confirmacion) {
      this.httpService.EliminarG(id_guest)
        .subscribe(
          () => {
            alert('Usuario eliminado correctamente');
            this.LeerTodoG();
          },
          (error) => {
            console.error('Error al eliminar el Usuario:', error);
            console.log(id_guest)
          }
        );
    }
  }
  editarGuest(id_guest: number) {
    const guest = this.dataSource.data.find(guest => guest.id_guest === id_guest);
    if (guest) {
      this.guestData = guest;
      const dialogRef = this.dialog.open(FormEditComponent, {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px'},
        width: '700px',
        data: {
          guestData: this.guestData
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.LeerTodoG();
      });
    } else {
      console.error('No se pudo encontrar la habitación con el ID especificado.');
    }
  }
}
