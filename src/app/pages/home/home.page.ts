import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
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
import { ReservationService } from 'src/app/services/reservation';

// Tell TypeScript about the global `google` object from the Maps script
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
    IonRouterLink,
  ],
})
export class HomePage implements OnInit, AfterViewInit {
  destination = '';

  @ViewChild('map', { static: false }) mapElement!: ElementRef<HTMLDivElement>;
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef<HTMLInputElement>;

  private map!: any;
  private autocomplete!: any;

  constructor(
    private router: Router,
    private reservationService: ReservationService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
    this.initAutocomplete();
  }

  private initMap() {
    // Default center (example: Sheridan College Trafalgar)
    const center = { lat: 43.468, lng: -79.699 };

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center,
      zoom: 15,
      disableDefaultUI: true,
    });
  }

  private initAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.searchInput.nativeElement,
      {
        fields: ['geometry', 'name'],
      }
    );

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      if (!place || !place.geometry) {
        return;
      }

      this.destination = place.name || '';
      const location = place.geometry.location;

      // Pan map to chosen location
      this.map.panTo(location);
      this.map.setZoom(16);
    });
  }

  search() {
    if (!this.destination.trim()) {
      return;
    }

    // keep your existing behaviour
    this.reservationService.setDestination(this.destination);
    this.router.navigateByUrl('/location');
  }
}
