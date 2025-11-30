import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton, IonButtons, IonBackButton, IonItem,
  IonLabel, IonSelect, IonSelectOption, IonContent,
  IonHeader, IonTitle, IonToolbar, AlertController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/services/reservation';

@Component({
  selector: 'app-lot',
  templateUrl: './lot.page.html',
  styleUrls: ['./lot.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonButton, IonButtons, IonBackButton,
    IonItem, IonLabel, IonSelect, IonSelectOption, IonContent,
    IonHeader, IonTitle, IonToolbar
  ]
})
export class LotPage implements OnInit {

  lotName: string = '';
  availableSpaces: number = 0;
  distance: string = '';

  allTimes: string[] = [];
  validEndTimes: string[] = [];

  startTime: string = '';
  endTime: string = '';

  constructor(
    private router: Router,
    private reservationService: ReservationService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
  this.generateTimes();

  const lot = this.reservationService.getLot();
  
  if (lot) {
    this.lotName = lot.name;
    this.availableSpaces = lot.availableSpaces;
    this.distance = lot.distance;
  }
}


  generateTimes() {
    const times: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 5) {
        const hour = h % 12 === 0 ? 12 : h % 12;
        const minute = m.toString().padStart(2, '0');
        const ampm = h < 12 ? 'AM' : 'PM';
        times.push(`${hour}:${minute} ${ampm}`);
      }
    }
    this.allTimes = times;
  }

  toDate(timeStr: string): Date {
    return new Date(`2000-01-01 ${timeStr}`);
  }

  updateEndTimes() {
    if (!this.startTime) {
      this.validEndTimes = [];
      return;
    }

    const start = this.toDate(this.startTime);
    const maxEnd = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    this.validEndTimes = this.allTimes.filter(t => {
      const tDate = this.toDate(t);
      return tDate > start && tDate <= maxEnd;
    });

    if (!this.validEndTimes.includes(this.endTime)) {
      this.endTime = '';
    }
  }

  async reserve() {
  if (!this.startTime || !this.endTime) {
    alert("Please select a valid start and end time.");
    return;
  }

    const alertBox = await this.alertCtrl.create({
      header: 'Confirm Reservation',
      message: `<strong>Lot:</strong> ${this.lotName}<br>
      <strong>Start:</strong> ${this.startTime}<br>
      <strong>End:</strong> ${this.endTime}<br><br>
      Are you sure you want to reserve this spot?`,
            buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => this.saveReservation()
        }
      ]
    });


  await alertBox.present();
}


  private saveReservation() {
  this.reservationService.addReservation(
    this.reservationService.getDestination(),
    this.lotName,
    this.startTime,
    this.endTime
  );

  this.router.navigateByUrl('/account');
}

}
