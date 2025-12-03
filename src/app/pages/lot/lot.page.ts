import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton, 
  IonContent,
  IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-lot',
  templateUrl: './lot.page.html',
  styleUrls: ['./lot.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonButton, IonContent,
    IonHeader, IonTitle, IonToolbar
  ]
})
export class LotPage implements OnInit, AfterViewInit {

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