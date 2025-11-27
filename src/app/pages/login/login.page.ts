import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth';
import { Router } from '@angular/router';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonRouterLink, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonRouterLink, CommonModule, FormsModule, IonInput, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSegment, IonSegmentButton, IonLabel, IonItem, IonButton]
})
export class LoginPage implements OnInit {
segment: 'login' | 'signup' = 'login';

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  phoneNumber = '';
  plateNumber = '';

  constructor(private auth: AuthService, private router: Router) {}

  async onLogin() {
    if (await this.auth.login(this.name, this.password)) {
      this.router.navigateByUrl('/home');
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
      phone: this.phoneNumber,
      plate: this.plateNumber,
      password: this.password,
    });

    this.router.navigateByUrl('/home');
  }

  onGuest() {
    console.log('GUEST BUTTON CLICKED');  // Debug
    this.auth.continueAsGuest();

    this.router.navigate(['/home']).then(success => {
    console.log("Navigation result:", success);
  });
}
  ngOnInit() {
  }

}
