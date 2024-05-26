import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { format } from 'date-fns';
import { iRecords } from 'src/app/interfaces/iRecords';
import { iRoom } from 'src/app/interfaces/iRoom';
import { HttpService } from 'src/app/services/http.service';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  // Declaramos las columnas que vamos utilizar
  displayedColumns: string[] = [
    'record_fullname',
    'record_dni',
    'record_phone_number',
    'record_admission_date',
    'record_departure_date',
    'record_room',
  ];
  dataSource = new MatTableDataSource<any>([]);
  recordData: any;
  // accedemosa una instancia del paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // inicializamos variables
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  rooms = this._formBuilder.group({
    actived: false,
    desactived: false,
  });
  room = new FormControl([]);
  availableRooms: iRoom[] = [];
  searchTerm: string = '';
  // Inyectamos dependencias necesarias para el correcto funcionamiento
  constructor(
    private httpService: HttpService,
    private generateReport: ReportsService,
    private _formBuilder: FormBuilder
  ) {}
  // Inicializamos la tabla Y las habitaciones en el ngOnInit
  ngOnInit(): void {
    this.obtenerRooms();
    this.initialRecords();

    //Si se realizan cambios los pasamos al UpdateDataSource.
    this.range.valueChanges.subscribe(() => this.updateDataSource());
    this.room.valueChanges.subscribe(() => this.updateDataSource());
    this.rooms.valueChanges.subscribe(() => this.updateDataSource());
  }
  // Metodo para obtener las habitaciones
  async obtenerRooms() {
    try {
      const registrosRooms = await this.httpService.LeerTodo().toPromise();
      this.availableRooms = registrosRooms || []; // Manejar undefined
    } catch (error) {
      console.error('Error fetching rooms:', error);
      this.availableRooms = []; // En caso de error, inicializar como array vacío
    }
  }
  // Metodo para inicializar los registros
  async initialRecords() {
    try {
      const registros = await this.obtenerRegistros();
      this.dataSource.data = registros;
      this.dataSource.paginator = this.paginator;
    } catch (error) {
      console.error('Error fetching initial records:', error);
      this.dataSource.data = [];
    }
  }
  // Metodo para obtener todos los registros
  async obtenerRegistros(): Promise<iRecords[]> {
    try {
      const registros = await this.httpService.LeerTodoR().toPromise();
      return registros || [];
    } catch (error) {
      console.error('Error fetching records:', error);
      return [];
    }
  }
  // Metodo para actualizar el Data source con los cambios que se realice
  async updateDataSource() {
    try {
      const registros = await this.obtenerRegistros();
      if (registros.length > 0) {
        const startDate = this.range.value.start;
        const endDate = this.range.value.end;
        endDate?.setHours(23, 59, 59);
        const selectedRooms: number[] = this.room.value || [];
        let filteredRegistros = registros;

        // Filtrar por rango de fechas
        if (startDate && endDate) {
          filteredRegistros = filteredRegistros.filter((registro) => {
            const admissionDate = new Date(registro.record_admission_date);
            const departureDate = new Date(registro.record_departure_date);
            return (
              (admissionDate >= startDate && admissionDate <= endDate) ||
              (departureDate >= startDate && departureDate <= endDate) ||
              (admissionDate <= startDate && departureDate >= endDate)
            );
          });
        }

        // Filtrar por 'actived' y 'desatived'
        const roomsActived = this.rooms.value.actived;
        const roomsDesactives = this.rooms.value.desactived;
        if (roomsActived) {
          filteredRegistros = filteredRegistros.filter(
            (registro) => registro.id_guest !== null
          );
        } else if (roomsDesactives) {
          filteredRegistros = filteredRegistros.filter(
            (registro) => registro.id_guest == null
          );
        }

        // Filtrar por habitaciones seleccionadas
        if (selectedRooms.length > 0) {
          filteredRegistros = filteredRegistros.filter((registro) => {
            return selectedRooms.includes(registro.id_room!); // Manejar id_room como no null
          });
        }

        // Filtrar registros según el término de búsqueda
        if (this.searchTerm.trim() !== '') {
          const searchLower = this.searchTerm.trim().toLowerCase();
          filteredRegistros = filteredRegistros.filter(
            (registro) =>
              registro.record_fullname.toLowerCase().includes(searchLower) ||
              registro.record_dni.toString().includes(searchLower) ||
              registro.record_phone_number.toString().includes(searchLower)
          );
        }
        // definimos el datasource con los registros filtrados
        this.dataSource.data = filteredRegistros;
      } else {
        console.warn('No records found.');
        this.dataSource.data = [];
      }
    } catch (error) {
      console.error('Error updating data source:', error);
      this.dataSource.data = [];
    }
  }
  // Metodo para generar el reporte por medio de PDF
  async generarReporte() {
    await this.updateDataSource();

    const registros = this.dataSource.data;
    if (registros.length > 0) {
      const encabezado = [
        'Full name',
        'Dni',
        'Phone Number',
        'Admission Date',
        'Departure Date',
        'Room',
      ];
      const cuerpo = registros.map((registro) => [
        registro.record_fullname.toString().trim(),
        registro.record_dni.toString().trim(),
        registro.record_phone_number,
        format(new Date(registro.record_admission_date), 'MMM d, yyyy'),
        format(new Date(registro.record_departure_date), 'MMM d, yyyy'),
        registro.record_room.toString().trim(),
      ]);
      // generamos el PDF por medio del servicio generateReport
      this.generateReport.reports(encabezado, cuerpo, 'REPORT LIST', true);
    } else {
      console.warn('No records found.');
    }
  }
  // Metodo para filtrar registros
  filtrarRegistros() {
    this.updateDataSource();
  }
}
