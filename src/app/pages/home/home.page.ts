import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonRouterLink,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/services/reservation';
import { HttpClient } from '@angular/common/http';

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
  parkingLots: any[] = [];   // <— data comes from backend
  markers: any[] = [];       // <— store markers so we can refresh them

  infoWindow: any;

  @ViewChild('map', { static: false }) mapElement!: ElementRef<HTMLDivElement>;
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef<HTMLInputElement>;

  private map!: any;
  private autocomplete!: any;

  constructor(
    private router: Router,
    private http: HttpClient,              // <— Added HttpClient
    private reservationService: ReservationService
  ) {}

  ngOnInit() {
    this.loadParkingLotsFromBackend();     // <— load backend data first
  }

  ngAfterViewInit() {
    this.initMap();
    this.initAutocomplete();
  }

  // ✅ STEP 1 — Load from backend API
  loadParkingLotsFromBackend() {
  this.http.get<any[]>('http://localhost:3000/lots')
    .subscribe({
      next: (data) => {
        console.log("Parking lots loaded:", data);
        this.parkingLots = data;
        this.placeParkingMarkers();
      },
      error: (err) => {
        console.error("Failed to load parking lots", err);
      }
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

      this.placeParkingMarkers();  // <— redraw markers after moving map
    });
  }

  // ✅ STEP 2 — Place markers using BACKEND data
  private placeParkingMarkers() {

    // Remove old markers
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];

    this.parkingLots.forEach((lot) => {

      const marker = new google.maps.Marker({
        position: { lat: lot.lat, lng: lot.lng },
        map: this.map,
        title: lot.name,
      });

      this.markers.push(marker);

      const content = document.createElement('div');

      // Clean UI for info window
      content.innerHTML = `
        <strong>${lot.name}</strong><br/>
        <span>${lot.description}</span><br/><br/>
        <b>Available:</b> ${lot.availableSpace}<br/>
        <b>Total Spaces:</b> ${lot.totalSpace}<br/>
        <b>Handicap:</b> ${lot.handicapParking}
      `;

      content.style.cssText = `
        font-size: 14px;
        max-width: 240px;
        background-color: #e0f7fa;
        padding: 12px;
        border-radius: 6px;
        cursor: pointer;
        color: black;
      `;

      // Clicking popup → navigate to details
      content.addEventListener('click', () => {
        this.openLot(lot);
      });

      marker.addListener("click", () => {
       this.infoWindow.setContent(content);
       this.infoWindow.open(this.map, marker);
      });
    });
  }


  search() {
    if (!this.destination.trim()) return;

    this.reservationService.setDestination(this.destination);
    this.router.navigateByUrl('/location');
  }

  openLot(lot: any) {
    this.router.navigate(['/lot'], { state: { lot } });
  }
}
