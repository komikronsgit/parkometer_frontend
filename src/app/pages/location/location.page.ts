import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonBackButton,
  IonButtons,
  IonList
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ReservationService, ParkingLot } from 'src/app/services/reservation';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonBackButton,
    IonButtons,
    IonList
  ]
})
export class LocationPage implements OnInit {

  destination: string = '';
  lots: ParkingLot[] = [];

  constructor(
    private router: Router,
    private reservationService: ReservationService
  ) {}

  ngOnInit() {
    this.destination = this.reservationService.getDestination();
    this.loadLots();
  }

  // ----------------------------
  // Load mocked parking lots
  // ----------------------------
  loadLots() {
    this.lots = [
      { name: 'Lot A', availableSpaces: 12, distance: '2 min' },
      { name: 'Lot B', availableSpaces: 4, distance: '5 min' },
      { name: 'Lot C', availableSpaces: 20, distance: '1 min' }
    ];
  }

  // ----------------------------
  // User selects a lot
  // ----------------------------
  openLot(lot: ParkingLot) {
    this.reservationService.setSelectedLot(lot);
    this.router.navigateByUrl('/lot');
  }

}
