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
    'record_fullname',
    'record_dni',
    'record_phone_number',
    'record_admission_date',
    'record_departure_date',
    'record_room',
    'id_guest',
    'id_room',
    'menu'
  ];
  dataSource = new MatTableDataSource<any>([]);
  recordData: any;

  constructor(private httpService: HttpService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.LeerTodoR();
  }

  LeerTodoR() {
    this.httpService.LeerTodoR().subscribe((respuesta) => {
      console.log(respuesta);
      this.dataSource.data = respuesta;
    });
  }
}
