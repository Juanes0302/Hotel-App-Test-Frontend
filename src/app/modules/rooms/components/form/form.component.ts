import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { iRoom } from 'src/app/interfaces/iRoom';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  // Declaramos las variables que vamos a utilizar
  formGroup!: FormGroup;
  // Inyectamos dependencias necesarias para el correcto funcionamiento
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormComponent>,
    private fb: FormBuilder,
    private httpService: HttpService
  ) {
    this.initForm();
  }
  ngOnInit(): void {}
  // Metodo para cancelar el formulario
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
  //metodo para guardar el formulario
  guardar() {
    if (this.formGroup.valid) {
      const formData: iRoom = this.formGroup.value;
      this.httpService.Crear(formData).subscribe(
        (response) => {
          console.log('The room has been saved successfully:', response);
          this.dialogRef.close();
        },
        (error) => {
          console.error('error saving room:', error);
        }
      );
    }
  }
}
