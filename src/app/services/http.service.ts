import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface iRoom {
  id_room: number;
  room_identity: string;
  room_type: string;
  bedroom_numbers: number;
  bed_numbers: number;
  number_bathrooms: number;
  status: boolean;
}

export interface iGuest {
  id_guest: number;
  guest_fullname: string;
  guest_dni: string;
  guest_phone_number: number;
  admission_date: Date;
  departure_date: Date;
  id_room: number;
}

export interface iRecords{
  id_record: number;
  record_fullname: string;
  record_dni: string;
  record_phone_number: number;
  record_admission_date: Date;
  record_departure_date: Date;
  id_guest?: number;
  id_room?: number;
}

export interface ilogin{
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  LeerTodo(): Observable<iRoom[]> {
    let parametros = new HttpParams();
    return this.httpClient.get<iRoom[]>('https://localhost:7237/api/Rooms', {
      params: parametros,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  getRooms(): Observable<iRoom[]> {
    return this.LeerTodo().pipe(
      map((rooms: iRoom[]) => rooms.filter(room => room.status === true))
    );
  }

  LeerTodoG(): Observable<iGuest[]> {
    let parametros = new HttpParams();
    return this.httpClient.get<iGuest[]>('https://localhost:7237/api/Guest',{
      params : parametros,
      headers:{
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  LeerTodoR(): Observable<iRecords[]> {
    let parametros = new HttpParams();
    return this.httpClient.get<iRecords[]>('https://localhost:7237/api/Records',{
      params : parametros,
      headers:{
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  Crear(room:  iRoom): Observable<iRoom[]> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.httpClient.post<iRoom[]>('https://localhost:7237/api/Rooms', room, { headers: headers });
  }

  CrearGuest(guest: iGuest): Observable<iGuest[]> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.httpClient.post<iGuest[]>('https://localhost:7237/api/Guest', guest, {headers: headers});
  }

  Eliminar(id_room: number) {
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: id_room
    };
    return this.httpClient.delete(`https://localhost:7237/api/Rooms/${id_room}`, option);
  }

  EliminarG(id_guest: number) {
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: id_guest
    };
    return this.httpClient.delete(`https://localhost:7237/api/Guest/${id_guest}`, option);
  }

  EliminarR(id_record: number) {
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: id_record
    };
    return this.httpClient.delete(`https://localhost:7237/api/Records/${id_record}`, option);
  }
  Actualizar(room: iRoom): Observable<iRoom> {
    const url = `https://localhost:7237/api/Rooms/${room.id_room}`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.httpClient.put<iRoom>(url, room, { headers: headers });
  }

  ActualizarG(guest: iGuest): Observable<iGuest> {
    const url = `https://localhost:7237/api/Guest/${guest.id_guest}`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
  
    return new Observable<iGuest>((observer) => {
      // Verificar si existe guest
      if (!guest) {
        observer.error('Invalid guest data.');
        return;
      }

      // Obtener la habitación anterior del huésped
      this.httpClient.get<iGuest>(url).subscribe((guestData: iGuest) => {
        const previousRoomId = guestData.id_room;
        if (previousRoomId !== guest.id_room) {
          // Cambiar el estado de la habitación anterior a disponible
          this.httpClient.get<iRoom>(`https://localhost:7237/api/Rooms/${previousRoomId}`).subscribe((previousRoom: iRoom) => {
            previousRoom.status = true;
            this.Actualizar(previousRoom).subscribe(() => {
              console.log('Previous room status updated successfully.');
            }, (error) => {
              console.error('Error updating previous room status:', error);
            });
          }, (error) => {
            console.error('Error fetching previous room:', error);
          });
  
          // Cambiar el estado de la nueva habitación a ocupada
          this.httpClient.get<iRoom>(`https://localhost:7237/api/Rooms/${guest.id_room}`).subscribe((newRoom: iRoom) => {
            newRoom.status = false;
            this.Actualizar(newRoom).subscribe(() => {
              console.log('New room status updated successfully.');
            }, (error) => {
              console.error('Error updating new room status:', error);
            });
          }, (error) => {
            console.error('Error fetching new room:', error);
          });
        }
      }, (error) => {
        console.error('Error fetching guest data:', error);
      });

      // Actualizar datos del huésped
      this.httpClient.put<iGuest>(url, guest, { headers: headers }).subscribe((updatedGuest: iGuest) => {
        observer.next(updatedGuest);
        observer.complete();
      }, (error) => {
        observer.error(error);
      });
    });
  }
  login(credentials: ilogin): Observable<ilogin[]> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.httpClient.post<ilogin[]>('https://localhost:7237/api/Login', credentials, {headers: headers});
  }
}
