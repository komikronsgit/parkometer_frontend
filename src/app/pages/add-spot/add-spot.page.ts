import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCheckbox,
  IonDatetime,
} from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-spot',
  templateUrl: './add-spot.page.html',
  styleUrls: ['./add-spot.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCheckbox,
    IonDatetime,
  ],
})
export class AddSpotPage implements OnInit {
  spot = {
    name: '',
    address: '',
    hasSpecialTimings: false,
    timingFrom: '',
    timingTo: '',
    isPaid: false,
    pricePerHour: 0,
    lat: 0,
    lng: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.spot.lat = +params['lat'] || 0;
      this.spot.lng = +params['lng'] || 0;
    });
  }

  saveSpot() {
    this.http.post('http://localhost:3000/spots', this.spot).subscribe({
      next: () => {
        alert('Spot saved successfully!');
        // navigate back to location after saving
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/location']);
        });
      },
      error: (err) => {
        console.error('Error saving spot:', err);
        alert('Error saving spot');
      },
    });
  }
}
