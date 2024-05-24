import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { format } from 'date-fns';
import { HttpService, iRecords, iRoom } from 'src/app/services/http.service';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
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

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  rooms = this._formBuilder.group({
    actived: false,
    desactived: false
  });
  room = new FormControl([]);
  availableRooms: iRoom[] = [];
  searchTerm: string = '';

  constructor(
    private httpService: HttpService,
    private generateReport: ReportsService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchRooms();
    this.fetchInitialRecords();

    // Subscribe to changes in form controls
    this.range.valueChanges.subscribe(() => this.updateDataSource());
    this.room.valueChanges.subscribe(() => this.updateDataSource());
    this.rooms.valueChanges.subscribe(() => this.updateDataSource());
  }

  async fetchRooms() {
    try {
      const registrosRooms = await this.httpService.LeerTodo().toPromise();
      this.availableRooms = registrosRooms || []; // Manejar undefined
    } catch (error) {
      console.error('Error fetching rooms:', error);
      this.availableRooms = []; // En caso de error, inicializar como array vacío
    }
  }

  async fetchInitialRecords() {
    try {
      const registros = await this.obtenerRegistros();
      this.dataSource.data = registros;
    } catch (error) {
      console.error('Error fetching initial records:', error);
      this.dataSource.data = [];
    }
  }

  async obtenerRegistros(): Promise<iRecords[]> {
    try {
      const registros = await this.httpService.LeerTodoR().toPromise();
      return registros || [];
    } catch (error) {
      console.error('Error fetching records:', error);
      return [];
    }
  }

  async updateDataSource() {
    try {
      const registros = await this.obtenerRegistros();
      if (registros.length > 0) {
        const startDate = this.range.value.start;
        const endDate = this.range.value.end;
        endDate?.setHours(23, 59, 59);
        const selectedRooms: number[] = this.room.value || [];
        let filteredRegistros = registros;

        // Filtrar por rango de fechas si ambos están definidos
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

        // Filtrar por 'actived' y 'id_guest' no nulo
        const roomsActived = this.rooms.value.actived;
        const roomsDesactives = this.rooms.value.desactived;
        if (roomsActived) {
          filteredRegistros = filteredRegistros.filter(
            (registro) => registro.id_guest !== null
          );
        }else if(roomsDesactives){
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
      console.log(cuerpo);
      this.generateReport.reports(
        encabezado,
        cuerpo,
        'REPORT LIST',
        true
      );
    } else {
      console.warn('No records found.');
    }
  }

  filtrarRegistros() {
    this.updateDataSource();
  }
}
