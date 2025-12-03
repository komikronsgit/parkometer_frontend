import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar} from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { ReservationService } from 'src/app/services/reservation';
import { Router } from '@angular/router';

declare const google: any;

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
    IonToolbar
  ]
})
export class LocationPage implements AfterViewInit {

  @ViewChild('map', { static: false }) mapElement!: ElementRef;

  map: any;
  markers: any[] = [];
  infoWindow: any;

  parkingLots: any[] = [];

  destination: string = '';


  constructor(private http: HttpClient, private reservationService: ReservationService, private router: Router,) {}

  ngOnInit() {
  this.destination = this.reservationService.getDestination();
}

  ngAfterViewInit() {
    this.initMap();
    this.loadParkingLots();
  }

  initMap() {
    const center = { lat: 43.468, lng: -79.699 };

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center,
      zoom: 15,
    });

    this.infoWindow = new google.maps.InfoWindow();
  }

  loadParkingLots() {
    this.http.get<any[]>("http://localhost:3000/lots").subscribe(
      (data) => {
        this.parkingLots = data;
        this.placeMarkers();
      },
      (error) => console.error("Error loading parking lots:", error)
    );
  }

  placeMarkers() {
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];

    this.parkingLots.forEach(lot => {
      const marker = new google.maps.Marker({
        position: { lat: lot.lat, lng: lot.lng },
        map: this.map,
        title: lot.name,
      });

      this.markers.push(marker);

      marker.addListener("click", () => {
        this.focusLot(lot);
      });
    });
  }

  // When clicking a lot from the list OR marker
  focusLot(lot: any) {
    this.map.panTo({ lat: lot.lat, lng: lot.lng });
    this.map.setZoom(18);

    const content = `
      <div style="font-size:14px; max-width:200px;">
        <strong>${lot.name}</strong><br/>
        ${lot.description}<br/><br/>
        <b>Available:</b> ${lot.availableSpace}<br/>
        <b>Total:</b> ${lot.totalSpace}<br/>
        <b>Handicap:</b> ${lot.handicapParking}
      </div>
    `;

    this.infoWindow.setContent(content);
    this.infoWindow.open(this.map, this.markers.find(m => m.title === lot.name));
  }
  openLot(lot: any) {
  this.router.navigate(['/lot'], { state: { lot }} );
}


}