import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpService, iRecords } from 'src/app/services/http.service';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  range = new FormGroup({
  start: new FormControl<Date | null>(null),
  end: new FormControl<Date | null>(null),
  });

  constructor(
    private httpService: HttpService,
    private generateReport: ReportsService
  ) {}

  ngOnInit(): void {}

  async obtenerRegistros(): Promise<iRecords[]> {
    try {
      const registros = await this.httpService.LeerTodoR().toPromise();
      return registros || [];
    } catch (error) {
      console.error('Error fetching records:', error);
      return [];
    }
  }

  async generarReporte() {
    try {
      const registros = await this.obtenerRegistros();
      if (registros.length > 0) {
        const startDate = this.range.value.start;
        const endDate = this.range.value.end;

        let filteredRegistros = registros;

        if (startDate && endDate) {
          filteredRegistros = registros.filter(registro => {
            const admissionDate = new Date(registro.record_admission_date);
            const departureDate = new Date(registro.record_departure_date);
            return admissionDate >= startDate && departureDate <= endDate;
          });
        }

        const encabezado = ["Full name", "Dni", "Phone Number", "Admission Date", "Departure Date", "Room", "Id Room"];
        const cuerpo = filteredRegistros.map(registro => [
          registro.record_fullname.toString().trim(),
          registro.record_dni.toString().trim(),
          registro.record_phone_number,
          registro.record_admission_date,
          registro.record_departure_date,
          registro.record_room.toString().trim(),
          registro.id_room
        ]);
       console.log(cuerpo)
        this.generateReport.reports(encabezado, cuerpo, "Listado de Registros", false);
      } else {
        console.warn("No records found.");
      }
    } catch (error) {
      console.error("Error al generar el reporte:", error);
    }
  }
}