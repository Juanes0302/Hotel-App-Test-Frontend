import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';
import { FormComponent } from '../form/form.component';
import { iRoom } from 'src/app/interfaces/iRoom';

@Component({
  selector: 'app-form-edit',
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.css'],
})
export class FormEditComponent implements OnInit {
  // Declaramos las variables que vamos a utilizar
  formGroup!: FormGroup;
  roomData: iRoom;
  // Inyectamos dependencias necesarias para el correcto funcionamiento
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormComponent>,
    private fb: FormBuilder,
    private httpService: HttpService
  ) {
    this.roomData = data.roomData;
    this.initForm();
  }
  // Inicializamos el formulario con su data en el ngOnInit
  ngOnInit(): void {
    this.initFormWithData();
  }
  // Metodo para cancelar el dialog
  cancelar() {
    this.dialogRef.close();
  }
  // Metodo para inicializar el formulario
  initForm() {
    this.formGroup = this.fb.group({
      room_identity: ['', [Validators.required]],
      room_type: ['', [Validators.required]],
      bedroom_numbers: ['', [Validators.required]],
      bed_numbers: [''],
      number_bathrooms: ['', [Validators.required]],
      status: [true, [Validators.required]],
    });
  }
  // Metodo para inicializar el formulario con sus datos
  initFormWithData() {
    if (this.roomData) {
      this.formGroup.patchValue({
        room_identity: this.roomData.room_identity,
        room_type: this.roomData.room_type,
        bedroom_numbers: this.roomData.bedroom_numbers,
        bed_numbers: this.roomData.bed_numbers,
        number_bathrooms: this.roomData.number_bathrooms,
        status: this.roomData.status,
      });
    } else {
      console.error('No se recibieron datos del elemento de la base de datos.');
    }
  }
  // Metodo para guardar los cambios del formulario
  guardar() {
    if (this.formGroup.valid) {
      const formData: iRoom = this.formGroup.value;
      formData.id_room = this.roomData.id_room;
      this.httpService.Actualizar(formData).subscribe(
        (response) => {
          console.log('The room has been updated successfully:', response);
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error updating room:', error);
        }
      );
    }
  }
}
