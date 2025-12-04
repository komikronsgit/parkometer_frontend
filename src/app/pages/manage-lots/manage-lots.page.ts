import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-manage-lots',
  standalone: true,
  templateUrl: './manage-lots.page.html',
  styleUrls: ['./manage-lots.page.scss'],
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonIcon
  ]
})
export class ManageLotsPage implements OnInit {

  lots: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadLots();
  }

  loadLots() {
    this.http.get<any[]>('http://localhost:3000/lots')
      .subscribe((data) => (this.lots = data));
  }

  editLot(lot: any) {
    this.router.navigate(['/add-lot'], { state: { lot } });
  }

  deleteLot(id: string) {
    if (!confirm('Are you sure you want to delete this parking lot?')) return;

    this.http.delete(`http://localhost:3000/lots/${id}`)
      .subscribe(() => this.loadLots());
  }

}
