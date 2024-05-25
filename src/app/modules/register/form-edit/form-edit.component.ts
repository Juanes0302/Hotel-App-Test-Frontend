import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';
import { FormComponent } from '../components/form/form.component';
import { iLogin } from 'src/app/interfaces/iLogin';

@Component({
  selector: 'app-form-edit',
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.css']
})
export class FormEditComponent implements OnInit {
  formGroup!: FormGroup;
  userData: iLogin;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormComponent>,
    private fb: FormBuilder,
    private httpService: HttpService
  ) {
    this.userData = data.userData;
    this.initForm();
  }

  ngOnInit(): void {
    console.log('user data:', this.userData);
    this.initFormWithData();
  }

  cancelar() {
    this.dialogRef.close();
  }

  initForm() {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      id_rol: ['', [Validators.required]],
    });
  }

  initFormWithData() {
    if (this.userData) {
      this.formGroup.patchValue({
        email: this.userData.email,
        password: this.userData.password,
        id_rol: this.userData.id_rol,  // Aquí se corrige el error
      });
      console.log('id_rol:', this.userData.id_rol);
    } else {
      console.error('No se recibieron datos del Usuario de la base de datos.');
    }
  }

  guardar() {
    if (this.formGroup.valid) {
      const formData: iLogin = this.formGroup.value;
      formData.id = this.userData.id;
      this.httpService.ActualizarU(formData).subscribe((response) => {
        console.log('The user has been updated successfully:', response);
        this.dialogRef.close();
      },
      (error) => {
        console.error('Error updating user:', error);
      });
    }
  }
}