import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonItem, IonLabel, IonTitle, IonToolbar, ToastController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/services/reservation';


@Component({
  selector: 'app-lot',
  templateUrl: './lot.page.html',
  styleUrls: ['./lot.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule, 
    IonButton, 
    IonBackButton, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle, 
    IonCardContent, 
    IonLabel, 
    IonItem, 
    IonButtons]
})
export class LotPage implements OnInit {
lot: any;
  destination = '';
  totalSpaces = 50;
  availableSpaces = 12;

  startTime = '';
  endTime = '';

  constructor(
    private resService: ReservationService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.lot = this.resService.getLot();
    this.destination = this.resService.getDestination();
  }

  private isWithinTwoHours(start: string, end: string): boolean {
    if (!start || !end) return false;
    const s = new Date(`1970-01-01T${start}`);
    const e = new Date(`1970-01-01T${end}`);
    const diffMs = e.getTime() - s.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 2;
  }

  async onReserve() {
    if (!this.startTime || !this.endTime) {
      const t = await this.toastCtrl.create({
        message: 'Please select start and end time.',
        duration: 2000,
        color: 'warning',
      });
      t.present();
      return;
    }

    if (!this.isWithinTwoHours(this.startTime, this.endTime)) {
      const t = await this.toastCtrl.create({
        message: 'Maximum reservation time is 2 hours.',
        duration: 2000,
        color: 'danger',
      });
      t.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Confirm Reservation',
      message: 'Are you sure you want to reserve this parking space?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Reserve',
          handler: () => {
            this.resService.addReservation(
              this.destination,
              this.lot?.name ?? 'Selected Lot',
              this.startTime,
              this.endTime
            );
            this.router.navigateByUrl('/account');
          },
        },
      ],
    });

    await alert.present();
  }
}
