import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iGuest } from 'src/app/interfaces/iGuest';
import { iRoom } from 'src/app/interfaces/iRoom';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  // Declaramos las variables que vamos a utilizar
  formGroup!: FormGroup;
  availableRooms: iRoom[] = [];
  // Inyectamos dependencias necesarias para el correcto funcionamiento
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormComponent>,
    private fb: FormBuilder,
    private httpService: HttpService
  ) {
    this.initForm();
    this.loadRooms();
  }

  ngOnInit(): void {}
  // Metodo para cancelar el formulario
  cancelar() {
    this.dialogRef.close();
  }
  // Metodo para inicializar el formulario
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
  // Metodo para mostrar las habitaciones disponibles
  loadRooms() {
    this.httpService.getRooms().subscribe(
      (rooms: iRoom[]) => {
        this.availableRooms = rooms;
      },
      (error) => {
        console.error('Error loading available rooms:', error);
      }
    );
  }
  // Metodo para obtener las fechas seleccionadas en el datePicker
  handleDateSelection(event: any) {
    const arrivalDate = event.start.value;
    const departureDate = event.end.value;
    console.log('Fecha de llegada:', arrivalDate);
    console.log('Fecha de salida:', departureDate);

    // Asignar las fechas al formulario
    this.formGroup.patchValue({
      admission_date: arrivalDate,
      departure_date: departureDate,
    });
  }
  //metodo para guardar el formulario
  guardar() {
    if (this.formGroup.valid) {
      const formData: iGuest = this.formGroup.value;
      formData.admission_date = this.formGroup.get('admission_date')?.value;
      formData.departure_date = this.formGroup.get('departure_date')?.value;

      this.httpService.CrearGuest(formData).subscribe(
        (response) => {
          console.log('The guest has been saved successfully:', response);
          this.dialogRef.close();
        },
        (error) => {
          console.error('error saving guest:', error);
        }
      );
    }
  }
}
