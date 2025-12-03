import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.page.html',
  styleUrls: ['./reserve.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ReservePage implements OnInit {

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
}
