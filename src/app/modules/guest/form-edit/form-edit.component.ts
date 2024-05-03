import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService, iGuest, iRoom } from 'src/app/services/http.service'; // Asegúrate de importar iRoom
import { FormComponent } from '../components/form/form.component';

@Component({
  selector: 'app-form-edit',
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.css']
})
export class FormEditComponent implements OnInit {
  formGroup!: FormGroup;
  guestData: iGuest;
  availableRooms: iRoom[] = []; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormComponent>,
    private fb: FormBuilder,
    private httpService: HttpService
  ) {
    this.guestData = data.guestData;
    this.initForm();
  }

  ngOnInit(): void {
    console.log('user data:', this.guestData);
    this.initFormWithData();
    this.loadRooms();
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

  initFormWithData() {
    if (this.guestData) {
      this.formGroup.patchValue({
        guest_fullname: this.guestData.guest_fullname,
        guest_dni: this.guestData.guest_dni,
        guest_phone_number: this.guestData.guest_phone_number,
        admission_date: new Date(this.guestData.admission_date),
        departure_date: new Date(this.guestData.departure_date),
        id_room: this.guestData.id_room,
      });
      console.log('id_room:', this.guestData.id_room);
    } else {
      console.error('No se recibieron datos del Usuario de la base de datos.');
    }
  }

  guardar() {
    if (this.formGroup.valid) {
      const formData: iGuest = this.formGroup.value;
      formData.id_guest = this.guestData.id_guest;
      this.httpService.ActualizarG(formData).subscribe((response) => {
        console.log('The user has been updated successfully:', response);
        this.dialogRef.close();
      },
      (error) => {
        console.error('Error updating user:', error);
      });
    }
  }

  loadRooms() {
    this.httpService.getRooms().subscribe((rooms: iRoom[]) => {
      this.availableRooms = rooms;
      console.log('Available rooms:', this.availableRooms);
    }, (error) => {
      console.error('Error loading available rooms:', error);
    });
  }
}