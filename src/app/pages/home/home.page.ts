import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonRouterLink, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/services/reservation';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonButtons, IonInput, IonRouterLink]
})
export class HomePage implements OnInit {
  destination = '';

  constructor(private router: Router, private reservationService: ReservationService) {}

  search() {
    if (!this.destination.trim()) return;
    this.reservationService.setDestination(this.destination);
    this.router.navigateByUrl('/location');
  }
  ngOnInit() {
  }

}
