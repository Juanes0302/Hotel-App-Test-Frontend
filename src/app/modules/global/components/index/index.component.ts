import { Component, OnInit } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { iGuest } from 'src/app/interfaces/iGuest';
import { iRecords } from 'src/app/interfaces/iRecords';
import { iRoom } from 'src/app/interfaces/iRoom';
import { HttpService} from 'src/app/services/http.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  public chart: Chart;
  public roomChart: Chart;
  idRol: number | null = null;
  totalRecords: number = 0; // Variables para almacenar overview
  totalRooms: number = 0;
  totalGuest: number = 0;
  totalRoomsActived: number = 0

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    // Obtén el id_rol desde el localStorage
    const storedIdRol = localStorage.getItem('idRol');
    if (storedIdRol) {
      this.idRol = parseInt(storedIdRol, 10);
    }

    // Obtener registros y habitaciones
    this.httpService.LeerTodoR().subscribe((records: iRecords[]) => {
      this.totalRecords = records.length; // Asignar la longitud del array de registros al totalRecords
      this.httpService.LeerTodo().subscribe((rooms: iRoom[]) => {
        this.totalRooms = rooms.length - 1;
        this.totalRoomsActived = rooms.filter(room => room.status === true).length - 1;;
        const admissionsData = this.transformAdmissionsData(records);
        this.httpService.LeerTodoG().subscribe((guests: iGuest[]) =>{
        this.totalGuest = guests.length;
        })
        this.initAdmissionsChart(admissionsData);
      });
    });
  }

  transformAdmissionsData(records: iRecords[]): { labels: string[], data: number[] } {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const months = Array(12).fill(0);

    records.forEach(record => {
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
      data: filteredData
    };
  }

  initAdmissionsChart(data: { labels: string[], data: number[] }): void {
    this.chart = new Chart('chart', {
      type: 'bar' as ChartType,
      data: {
        labels: data.labels,
        datasets: [{
          label: '',
          data: data.data,
          backgroundColor: '#3f51b5', // Color de las barras blancas
          borderColor: 'white', // Color del borde negro
          borderWidth: 1 // Grosor del borde
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true // Iniciar el eje Y desde cero
          }
        },
        plugins:{
          legend:{
            display: false
          }
        }
      }
    });
  }
}
