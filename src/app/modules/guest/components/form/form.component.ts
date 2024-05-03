import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpService, iGuest, iRoom } from 'src/app/services/http.service';
import * as moment from 'moment';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  formGroup!: FormGroup;
  availableRooms: iRoom[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormComponent>,
    private fb: FormBuilder,
    private httpService: HttpService,
  ) {
    this.initForm();
    this.loadRooms();
  }

  ngOnInit(): void {
  }

  cancelar() {
    this.dialogRef.close();
  }

  initForm() {
    this.formGroup = this.fb.group({
      guest_fullname: ['', [Validators.required]],
      guest_dni: ['', [Validators.required]],
      guest_phone_number: ['', [Validators.required]],
      admission_date: [new Date()],
      departure_date: [new Date()],
      id_room: ['', [Validators.required]],
    });
  }

  loadRooms() {
    this.httpService.getRooms().subscribe((rooms: iRoom[]) => {
      this.availableRooms = rooms;
    }, (error) => {
      console.error('Error loading available rooms:', error);
    });
  }
  handleDateSelection(event: any) {
    const arrivalDate = event.start.value;
    const departureDate = event.end.value;
    console.log('Fecha de llegada:', arrivalDate);
    console.log('Fecha de salida:', departureDate);
    
    // Asignar las fechas al formulario
    this.formGroup.patchValue({
      admission_date: arrivalDate,
      departure_date: departureDate
    });
  }
  guardar() {
    if (this.formGroup.valid) {
      const formData: iGuest = this.formGroup.value;
      formData.admission_date = this.formGroup.get('admission_date')?.value;
      formData.departure_date = this.formGroup.get('departure_date')?.value;

      this.httpService.CrearGuest(formData).subscribe((response) => {
        console.log('The guest has been saved successfully:', response);
        this.dialogRef.close();
      },
      (error) => {
        console.error('error saving guest:', error);
      });
    }
  }
}

