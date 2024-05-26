import { Component, OnInit } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { iGuest } from 'src/app/interfaces/iGuest';
import { iRecords } from 'src/app/interfaces/iRecords';
import { iRoom } from 'src/app/interfaces/iRoom';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  // Inicializamos variables necesarias
  public chart: Chart;
  public roomChart: Chart;
  idRol: number | null = null;
  totalRecords: number = 0;
  totalRooms: number = 0;
  totalGuest: number = 0;
  totalRoomsActived: number = 0;

  // Inyectamos dependencias necesarias para el correcto funcionamiento
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    // Obtener registros y habitaciones
    this.httpService.LeerTodoR().subscribe((records: iRecords[]) => {
      this.totalRecords = records.length; // Asignar la longitud del array de registros al totalRecords
      this.httpService.LeerTodo().subscribe((rooms: iRoom[]) => {
        this.totalRooms = rooms.length - 1; // Asignar la longitud del array de registros al totalRooms
        this.totalRoomsActived =
          rooms.filter((room) => room.status === true).length - 1; //Utilizamos la propiedad filter para saber cuales estan "true" y asignamos la longitud a TotalRoomsActived
        const admissionsData = this.transformAdmissionsData(records); //asignamos la transformacion del data a admissionData
        this.httpService.LeerTodoG().subscribe((guests: iGuest[]) => {
          this.totalGuest = guests.length; // Asignar la longitud del array de registros al totalGuest
        });
        this.initAdmissionsChart(admissionsData); // inicializamos del chat con con su respectivo parametro
      });
    });
  }
  // Metodo que transforma los datos de Admission en un formato adecuado para su visualizacion
  transformAdmissionsData(records: iRecords[]): {
    labels: string[];
    data: number[];
  } {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    // Creamos un array con 12 elementos los cuales lo rellenamos con "0"
    const months = Array(12).fill(0);
    // Iteramos records para saber cuantas personas ingresaron por cada mes
    records.forEach((record) => {
      const date = new Date(record.record_admission_date);
      const month = date.getMonth();
      months[month]++;
    });

    // Filtrar los meses que tienen registros
    const filteredLabels = [];
    const filteredData = [];
    months.forEach((count, index) => {
      if (count > 0) {
        filteredLabels.push(monthNames[index]);
        filteredData.push(count);
      }
    });

    return {
      labels: filteredLabels,
      data: filteredData,
    };
  }
  // Metodo para inicializar nuestro grafico con sus respectivos parametros y estilos
  initAdmissionsChart(data: { labels: string[]; data: number[] }): void {
    this.chart = new Chart('chart', {
      type: 'bar' as ChartType,
      data: {
        labels: data.labels,
        datasets: [
          {
            label: '',
            data: data.data,
            backgroundColor: '#3f51b5', // Color de las barras blancas
            borderColor: 'white', // Color del borde negro
            borderWidth: 1, // Grosor del borde
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true, // Iniciar el eje Y desde cero
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
}
