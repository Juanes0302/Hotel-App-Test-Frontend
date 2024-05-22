import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService, ilogin } from 'src/app/services/http.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit{
  formGroup!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormComponent>,
    private fb: FormBuilder,
    private httpService: HttpService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
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
  guardar() {
    if (this.formGroup.valid) {
      const formData: ilogin = this.formGroup.value;

      this.httpService.CrearUsers(formData).subscribe((response) => {
        console.log('The guest has been saved successfully:', response);
        this.dialogRef.close();
      },
      (error) => {
        console.error('error saving guest:', error);
      });
    }
  }
}
