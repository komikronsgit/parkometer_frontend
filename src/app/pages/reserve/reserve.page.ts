import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonBackButton, IonButtons, IonLabel, IonItem, IonSelectOption, IonDatetime, IonModal, IonInput, IonDatetimeButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { IonBackButton } from '@ionic/angular/standalone';
import { IonButtons } from '@ionic/angular/standalone';

declare const google: any;

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.page.html',
  styleUrls: ['./reserve.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, 
    FormsModule, IonBackButton, IonButtons, IonLabel, IonItem, IonDatetime, IonModal, IonInput, IonDatetimeButton]
})
export class ReservePage implements OnInit, AfterViewInit {

  form = {
    name: '',
    plate: '',
    date: ''as string | null,
    timeIn: '',
    timeOut: '',
    period: ''
  };

  @ViewChild('map', { static: false }) mapElement!: ElementRef;

  lot: any;
  map: any;
  marker: any;

  constructor(private router: Router) {}

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.lot = nav?.extras?.state?.['lot'];
  }

  ngAfterViewInit() {
    if (this.lot) {
      this.initMap();
    }
  }

  initMap() {
    const position = { lat: this.lot.lat, lng: this.lot.lng };

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: position,
      zoom: 18,
    });

    this.marker = new google.maps.Marker({
      position,
      map: this.map,
      title: this.lot.name,
    });
  }

  onReserve() {
    console.log('Reservation data:', this.form, 'Lot:', this.lot);
    // later: call backend API here
  }
}
