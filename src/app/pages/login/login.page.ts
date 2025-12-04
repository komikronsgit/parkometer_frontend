import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonInput,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonItem,
    IonButton
  ]
})
export class LoginPage implements OnInit {
  segment: 'login' | 'signup' = 'login';

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  phoneNumber = '';
  plateNumber = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  async onLogin() {

    // ADMIN LOGIN
    if (this.name === 'admin' && this.password === 'admin') {
      try {
        await this.http.post('http://localhost:3000/admin/login', {
          name: 'admin',
          password: 'admin'
        }).toPromise();

        this.router.navigateByUrl('/admin-dashboard');
        return;

      } catch (err) {
        alert('Invalid Admin Credentials');
        return;
      }
    }

    // NORMAL USER LOGIN
    if (await this.auth.login(this.name, this.password)) {
      this.router.navigateByUrl('/home');
    } else {
      alert('Invalid username or password.');
    }
  }

  onSignUp() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.auth.signUp({
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phoneNumber,
      plate: this.plateNumber
    });

    this.router.navigateByUrl('/home');
  }

  onGuest() {
    this.auth.continueAsGuest();
    this.router.navigate(['/home']);
  }

  ngOnInit() {}
}
