import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/http.service';

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
  crearGuest(){

  }
}
