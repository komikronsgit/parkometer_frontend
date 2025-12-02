import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonItem,
  IonInput,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpotService } from '../../services/spot.service';
import 'leaflet/dist/leaflet.css';

const DefaultIcon = L.icon({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonItem,
    IonInput,
    CommonModule,
    FormsModule,
  ],
})
export class LocationPage implements AfterViewInit {
  private map!: L.Map;
  searchQuery: string = '';

  constructor(private router: Router, private spotService: SpotService) {}

  ngAfterViewInit() {
    setTimeout(() => this.initMap(), 300);
  }

  private initMap(): void {
    this.map = L.map('map').setView([43.4675, -79.6877], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.spotService.getSpots().subscribe((spots: any[]) => {
      spots.forEach((spot) => {
        if (spot.lat && spot.lng) {
          L.marker([spot.lat, spot.lng])
            .addTo(this.map)
            .bindPopup(`<b>${spot.name}</b><br>${spot.address || ''}`);
        }
      });
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.router.navigate(['/add-spot'], {
        queryParams: { lat, lng },
      });
    });
  }

  searchLocation(): void {
    if (!this.searchQuery.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.searchQuery)}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          this.map.setView([+lat, +lon], 16);
          L.marker([+lat, +lon])
            .addTo(this.map)
            .bindPopup(this.searchQuery)
            .openPopup();
        } else {
          alert('Location not found.');
        }
      })
      .catch(() => alert('Error searching location.'));
  }
}
