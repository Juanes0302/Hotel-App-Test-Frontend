import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { iRoom } from '../interfaces/iRoom';
import { iGuest } from '../interfaces/iGuest';
import { iRecords } from '../interfaces/iRecords';
import { iLogin } from '../interfaces/iLogin';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  // Inyectamos dependencias necesarias para el correcto funcionamiento
  constructor(private httpClient: HttpClient) {}
  // Metodo para obtener todas las Habitaciones
  LeerTodo(): Observable<iRoom[]> {
    let parametros = new HttpParams();
    return this.httpClient.get<iRoom[]>('https://localhost:7237/api/Rooms', {
      params: parametros,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
  // Metodo para obtener solo las habitaciones que cuentan con su status en true
  getRooms(): Observable<iRoom[]> {
    return this.LeerTodo().pipe(
      map((rooms: iRoom[]) => rooms.filter((room) => room.status === true))
    );
  }
  // Metodo para obtener todos los Huespedes
  LeerTodoG(): Observable<iGuest[]> {
    let parametros = new HttpParams();
    return this.httpClient.get<iGuest[]>('https://localhost:7237/api/Guest', {
      params: parametros,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
  // Metodo para obtener todos los Registros
  LeerTodoR(): Observable<iRecords[]> {
    let parametros = new HttpParams();
    return this.httpClient.get<iRecords[]>(
      'https://localhost:7237/api/Records',
      {
        params: parametros,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
  // Metodo para obtener todos los Usuarios
  LeerTodoU(): Observable<iLogin[]> {
    let parametros = new HttpParams();
    return this.httpClient.get<iLogin[]>(
      'https://localhost:7237/api/Login/users',
      {
        params: parametros,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
  /*---------------------------------------------*/
  // Metodo para crear una nueva habitacion
  Crear(room: iRoom): Observable<iRoom[]> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    return this.httpClient.post<iRoom[]>(
      'https://localhost:7237/api/Rooms',
      room,
      { headers: headers }
    );
  }
  // Metodo para crear un nuevo Huesped
  CrearGuest(guest: iGuest): Observable<iGuest[]> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    return this.httpClient.post<iGuest[]>(
      'https://localhost:7237/api/Guest',
      guest,
      { headers: headers }
    );
  }
  // Metodo para crear un nuevo Usuario
  CrearUsers(login: iLogin): Observable<iLogin[]> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    return this.httpClient.post<iLogin[]>(
      'https://localhost:7237/api/Login/register',
      login,
      { headers: headers }
    );
  }
  /*---------------------------------------------*/
  // Metodo para eliminar una habitacion
  Eliminar(id_room: number) {
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: id_room,
    };
    return this.httpClient.delete(
      `https://localhost:7237/api/Rooms/${id_room}`,
      option
    );
  }
  // Metodo para eliminar un Huesped
  EliminarG(id_guest: number) {
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: id_guest,
    };
    return this.httpClient.delete(
      `https://localhost:7237/api/Guest/${id_guest}`,
      option
    );
  }
  // Metodo para eliminar un Registro
  EliminarR(id_record: number) {
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: id_record,
    };
    return this.httpClient.delete(
      `https://localhost:7237/api/Records/${id_record}`,
      option
    );
  }
  // Metodo para eliminar un Usuario
  EliminarU(id: number) {
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: id,
    };
    return this.httpClient.delete(
      `https://localhost:7237/api/Login/${id}`,
      option
    );
  }
  /*---------------------------------------------*/
  // Metodo para actualizar una habitacion
  Actualizar(room: iRoom): Observable<iRoom> {
    const url = `https://localhost:7237/api/Rooms/${room.id_room}`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    return this.httpClient.put<iRoom>(url, room, { headers: headers });
  }
  // Metodo para actualizar un usuario
  ActualizarU(login: iLogin): Observable<iLogin> {
    const url = `https://localhost:7237/api/Login/${login.id}`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    return this.httpClient.put<iLogin>(url, login, { headers: headers });
  }
  // Metodo para actualizar un Huesped
  ActualizarG(guest: iGuest): Observable<iGuest> {
    const url = `https://localhost:7237/api/Guest/${guest.id_guest}`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    return new Observable<iGuest>((observer) => {
      // Verificar si existe el huesped
      if (!guest) {
        observer.error('Invalid guest data.');
        return;
      }

      // Obtener la habitación anterior del huésped
      this.httpClient.get<iGuest>(url).subscribe(
        (guestData: iGuest) => {
          const previousRoomId = guestData.id_room;
          if (previousRoomId !== guest.id_room) {
            // Cambiar el estado de la habitación anterior a disponible
            this.httpClient
              .get<iRoom>(`https://localhost:7237/api/Rooms/${previousRoomId}`)
              .subscribe(
                (previousRoom: iRoom) => {
                  previousRoom.status = true;
                  this.Actualizar(previousRoom).subscribe(
                    () => {
                      console.log('Previous room status updated successfully.');
                    },
                    (error) => {
                      console.error(
                        'Error updating previous room status:',
                        error
                      );
                    }
                  );
                },
                (error) => {
                  console.error('Error fetching previous room:', error);
                }
              );
            // Cambiar el estado de la nueva habitación a ocupada
            this.httpClient
              .get<iRoom>(`https://localhost:7237/api/Rooms/${guest.id_room}`)
              .subscribe(
                (newRoom: iRoom) => {
                  newRoom.status = false;
                  this.Actualizar(newRoom).subscribe(
                    () => {
                      console.log('New room status updated successfully.');
                    },
                    (error) => {
                      console.error('Error updating new room status:', error);
                    }
                  );
                },
                (error) => {
                  console.error('Error fetching new room:', error);
                }
              );
          }
        },
        (error) => {
          console.error('Error fetching guest data:', error);
        }
      );
      // Actualizar datos del huésped
      this.httpClient.put<iGuest>(url, guest, { headers: headers }).subscribe(
        (updatedGuest: iGuest) => {
          observer.next(updatedGuest);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
  // Metodo para validar los datos del usuario
  login(credentials: iLogin): Observable<iLogin[]> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    return this.httpClient.post<iLogin[]>(
      'https://localhost:7237/api/Login/validate',
      credentials,
      { headers: headers }
    );
  }
  // Metodo para obtener el idRol por mediod el email del usuario
  obtenerIdRol(email: string): Observable<number> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return this.httpClient.get<number>(
      `https://localhost:7237/api/Login?email=${email}`,
      { headers: headers }
    );
  }
}
