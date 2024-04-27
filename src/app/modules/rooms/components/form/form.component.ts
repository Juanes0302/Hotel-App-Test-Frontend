import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormComponent>,
    private fb: FormBuilder
  ) {
    this.initForm();
  }
  ngOnInit(): void {}
  cancelar() {
    this.dialogRef.close();
  }
  guardar() {}
  initForm() {
    this.formGroup = this.fb.group({
      room_identity: ['', [Validators.required]],
      room_type: ['', [Validators.required]],
      bedroom_numbers: ['', [Validators.required]],
      bed_numbers: [''],
      number_bathrooms: [false, [Validators.required]],
      status: [true, [Validators.required]],
    });
  }
}
