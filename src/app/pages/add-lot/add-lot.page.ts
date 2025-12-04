import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

declare var google: any;

@Component({
  selector: 'app-add-lot',
  templateUrl: './add-lot.page.html',
  styleUrls: ['./add-lot.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption
  ]
})
export class AddLotPage implements OnInit {

  map: any;
  marker: any;

  name = '';
  description = '';
  lat: number | null = null;
  lng: number | null = null;
  availableSpace: number | null = null;
  totalSpace: number | null = null;
  handicapParking = 'No';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    setTimeout(() => this.loadMap(), 300);
  }

  loadMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 43.468, lng: -79.699 },
      zoom: 17,
    });

    this.map.addListener('click', (event: any) => {
      this.setMarker(event.latLng);
    });
  }

  setMarker(latLng: any) {
    if (this.marker) this.marker.setMap(null);

    this.marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
    });

    this.lat = latLng.lat();
    this.lng = latLng.lng();
  }

  addLot() {
    if (!this.lat || !this.lng || !this.name || !this.totalSpace) {
      alert("Please fill all required fields and pick a location on map.");
      return;
    }

    const data = {
      adminName: "admin",
      name: this.name,
      description: this.description,
      lat: this.lat,
      lng: this.lng,
      availableSpace: this.availableSpace,
      totalSpace: this.totalSpace,
      handicapParking: this.handicapParking
    };

    this.http.post("http://localhost:3000/lots", data).subscribe({
      next: () => {
        alert("Parking lot added successfully!");
        // ✅ use Angular Router for redirect
        this.router.navigate(['/admin-dashboard']);
      },
      error: () => alert("Error adding lot")
    });
  }
}
