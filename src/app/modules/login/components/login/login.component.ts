import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  styleImage = 'Hotel';
  form!: FormGroup;
  errorMessage!: string;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  unsplashClass(): any {
    return {
      'min-height': '100%',
      background: `url("http://source.unsplash.com/random/1200x900?"${this.styleImage}) no-repeat center center`,
      'background-size': 'cover',
      position: 'relative',
    };
  }

  login(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      const credentials = this.form.value;
      this.httpService.login(credentials).subscribe(
        (response: any) => {
          const userEmail = credentials.email;
          // función para obtener el id_rol
          this.httpService.obtenerIdRol(userEmail).subscribe(
            (idRol: number) => {
              // Guardar el id_rol en localStorage
              localStorage.setItem('idRol', idRol.toString());
              // Redirige al usuario a la página principal
              location.href='/home';
            },
            (error: any) => {
              console.error('Error al obtener el id_rol:', error);
            }
          );
        },
        (error: any) => {
          alert('Invalid email or password');
        }
      );
    }
  }
}
