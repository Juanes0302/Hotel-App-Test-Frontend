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
}
