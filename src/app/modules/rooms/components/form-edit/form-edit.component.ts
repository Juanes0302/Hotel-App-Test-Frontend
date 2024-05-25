import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';
import { FormComponent } from '../form/form.component';
import { iRoom } from 'src/app/interfaces/iRoom';

@Component({
  selector: 'app-form-edit',
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.css']
})
export class FormEditComponent implements OnInit {
  formGroup!: FormGroup;
  roomData: iRoom;

constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<FormComponent>,
  private fb: FormBuilder,
  private httpService: HttpService
) {
  this.roomData = data.roomData;
  this.initForm();
}

  ngOnInit(): void {
    console.log('Room data:', this.roomData);
    this.initFormWithData();
  }

  cancelar() {
    this.dialogRef.close();
  }

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

  guardar() {
    if (this.formGroup.valid) {
      const formData: iRoom = this.formGroup.value;
      formData.id_room = this.roomData.id_room;
      this.httpService.Actualizar(formData).subscribe((response) => {
        console.log('The room has been updated successfully:', response);
        this.dialogRef.close();
      },
      (error) => {
        console.error('Error updating room:', error);
      });
    }
  }
}

