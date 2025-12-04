import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonList,
    IonItem,
    IonLabel
  ],
})
export class AdminDashboardPage implements OnInit {
  lots: any[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/admin-dashboard') {
        this.loadLots();
      }
    });
  }

  ngOnInit() {
    this.loadLots();
  }

  loadLots() {
    this.http.get<any[]>('http://localhost:3000/lots')
      .subscribe((data) => this.lots = data);
  }

  editLot(lot: any) {
    this.router.navigate(['/manage-lots'], { state: { lot } });
  }

  deleteLot(id: string) {
    if (!confirm('Are you sure you want to delete this parking lot?')) return;

    this.http.delete(`http://localhost:3000/lots/${id}`, {
      body: { adminName: "admin" }   // ✅ include adminName for adminAuth
    }).subscribe(() => this.loadLots());
  }
}
