import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/services/reservation';

interface Lot {
  name: string;
  availableLots: number;
  distance: string; // e.g. "3 min walk"
}

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonList, IonLabel, IonItem, IonButtons, IonIcon]
})
export class LocationPage implements OnInit {
  destination = '';
  lots: Lot[] = [];

  constructor(private router: Router, private resService: ReservationService) {}

  ngOnInit() {
    this.destination = this.resService.getDestination() || 'Selected Location';

    // Mock lots for now
    this.lots = [
      { name: 'Lot A - North', availableLots: 3, distance: '2 min walk to main building' },
      { name: 'Lot B - East', availableLots: 8, distance: '5 min walk to library' },
      { name: 'Lot C - Underground', availableLots: 1, distance: '1 min walk to admin office' },
    ];
  }

  selectLot(lot: Lot) {
    this.resService.setLot(lot);
    this.router.navigateByUrl('/lot');
  }
}
