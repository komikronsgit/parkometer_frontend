import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';  // <-- FIXED

import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonButton, IonButtons, IonBackButton, IonIcon,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonList, IonListHeader, IonItem, IonLabel
} from '@ionic/angular/standalone';

import { AuthService, User } from 'src/app/services/auth';
import { Reservation, ReservationService } from 'src/app/services/reservation';

@Component({
  selector: 'app-account',
  standalone: true,
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonButton, IonButtons, IonBackButton, IonIcon,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonList, IonListHeader, IonItem, IonLabel,
    CommonModule, FormsModule
  ]
})
export class AccountPage implements OnInit {

  user: User | null = null;
  reservations: Reservation[] = [];

  constructor(
    private auth: AuthService,
    private reservationService: ReservationService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    this.user = this.auth.getUser();
    this.reservations = this.reservationService.getReservations();
  }

  async confirmDelete(res: Reservation) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Reservation',
      message: 'Are you sure?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.reservationService.deleteReservation(res.id);
            this.loadData();
          },
        },
      ],
    });
    await alert.present();
  }

  async changeTime(res: Reservation) {
    const alert = await this.alertCtrl.create({
      header: 'Edit Time',
      inputs: [
        { name: 'start', type: 'time', value: res.startTime },
        { name: 'end', type: 'time', value: res.endTime }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: data => {
            this.reservationService.updateReservationTime(res.id, data.start, data.end);
            this.loadData();
          }
        }
      ]
    });

    await alert.present();
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
