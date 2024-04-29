import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface iRoom {
  id_room: number;
  room_identity: string;
  room_type: string;
  bedroom_numbers: number;
  bed_numbers: number;
  number_bathrooms: number;
  status: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private httpCliente: HttpClient) {}

  LeerTodo(): Observable<iRoom[]> {
    let parametros = new HttpParams();
    return this.httpCliente.get<iRoom[]>('https://localhost:7237/api/Rooms', {
      params: parametros,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
  Crear(room:  iRoom): Observable<iRoom[]>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.httpCliente.post<iRoom[]>('https://localhost:7237/api/Rooms', room, { headers: headers });
  }
  Eliminar(id_room: number){
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: id_room
    };
    return this.httpCliente.delete(`https://localhost:7237/api/Rooms/${id_room}`, option);
  }
  Actualizar(room: iRoom): Observable<iRoom> {
    const url = `https://localhost:7237/api/Rooms/${room.id_room}`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.httpCliente.put<iRoom>(url, room, { headers: headers });
  }
}

