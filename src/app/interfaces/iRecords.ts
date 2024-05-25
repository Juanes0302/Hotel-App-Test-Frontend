export interface iRecords{
    id_record: number;
    record_fullname: string;
    record_dni: string;
    record_phone_number: number;
    record_admission_date: Date ;
    record_departure_date: Date ;
    record_room: number;
    id_guest?: number;
    id_room?: number;
  }