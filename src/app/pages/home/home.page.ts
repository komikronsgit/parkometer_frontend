import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonRouterLink,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReservationService } from 'src/app/services/reservation';

declare const google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonItem,
    IonButtons,
    IonRouterLink
  ],
})
export class HomePage implements OnInit, AfterViewInit {

  destination = '';
  parkingLots: any[] = [];
  markers: any[] = [];

  infoWindow: any;

  @ViewChild('map', { static: false }) mapElement!: ElementRef<HTMLDivElement>;
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef<HTMLInputElement>;

  private map!: any;
  private autocomplete!: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private reservationService: ReservationService
  ) {}

  ngOnInit() {
    this.loadParkingLotsFromBackend();
  }

  ngAfterViewInit() {
    this.initMap();
    this.initAutocomplete();
  }

  // Load parking lots from backend
  loadParkingLotsFromBackend() {
    this.http.get<any[]>('http://localhost:3000/lots')
      .subscribe({
        next: (data) => {
          this.parkingLots = data;
          this.placeParkingMarkers();
        },
        error: (err) => console.error("Failed to load parking lots", err)
      });
  }

  private initMap() {
    const center = { lat: 43.468, lng: -79.699 };

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center,
      zoom: 15,
    });

    this.infoWindow = new google.maps.InfoWindow();
  }

  private initAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.searchInput.nativeElement,
      { fields: ['geometry', 'name'] }
    );

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      if (!place || !place.geometry) return;

      this.destination = place.name || '';
      const location = place.geometry.location;

      this.map.panTo(location);
      this.map.setZoom(18);
    });
  }

  // Place markers + clickable info window card
  private placeParkingMarkers() {

    this.markers.forEach(m => m.setMap(null));
    this.markers = [];

    this.parkingLots.forEach((lot) => {

      const marker = new google.maps.Marker({
        position: { lat: lot.lat, lng: lot.lng },
        map: this.map,
        title: lot.name,
      });

      this.markers.push(marker);

      const content = document.createElement("div");
      content.style.cssText = `
        font-size: 14px;
        max-width: 240px;
        background-color: #e0f7fa;
        padding: 12px;
        border-radius: 6px;
        cursor: pointer;
        color: black;
      `;

      content.innerHTML = `
        <strong>${lot.name}</strong><br/>
        ${lot.description}<br/><br/>

        <b>Available:</b> ${lot.availableSpace}<br/>
        <b>Total Spaces:</b> ${lot.totalSpace}<br/>
        <b>Handicap:</b> ${lot.handicapParking}
      `;

      // Clicking popup → navigate to details
      content.addEventListener("click", () => {
        this.openLot(lot);
      });

      // Clicking marker → show popup
      marker.addListener("click", () => {
        this.infoWindow.setContent(content);
        this.infoWindow.open(this.map, marker);
      });

    });
  }

  // Search → go to /location
  search() {
    if (!this.destination.trim()) return;

    this.reservationService.setDestination(this.destination);
    this.router.navigateByUrl('/location');
  }

  openLot(lot: any) {
    this.router.navigate(['/lot'], { state: { lot } });
  }
}
