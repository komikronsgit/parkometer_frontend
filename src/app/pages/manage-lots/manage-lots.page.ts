import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-manage-lots',
  standalone: true,
  templateUrl: './manage-lots.page.html',
  styleUrls: ['./manage-lots.page.scss'],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
  ]
})
export class ManageLotPage implements OnInit {
  lotForm!: FormGroup;
  lotId!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    const lot = nav?.extras?.state?.['lot'];

    if (lot) {
      this.lotId = lot._id;
      this.buildForm(lot);
    } else {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.lotId = id;
          this.http.get<any>(`http://localhost:3000/lots/${id}`).subscribe(data => {
            this.buildForm(data);
          });
        }
      });
    }
  }

  buildForm(lot: any) {
    this.lotForm = this.fb.group({
      name: [lot?.name || ''],
      description: [lot?.description || ''],
      lat: [lot?.lat || 0],
      lng: [lot?.lng || 0],
      availableSpace: [lot?.availableSpace || 0],
      totalSpace: [lot?.totalSpace || 0],
      handicapParking: [lot?.handicapParking || 'No']
    });
  }

  submitForm() {
    if (!this.lotId) return;

    const payload = {
      ...this.lotForm.value,
      adminName: "admin"   // ✅ required for adminAuth
    };

    this.http.put(`http://localhost:3000/lots/${this.lotId}`, payload)
      .subscribe({
        next: () => {
          alert('Lot updated successfully!');
          this.router.navigate(['/admin-dashboard']);
        },
        error: (err) => {
          console.error(err);
          alert('Error updating lot');
        }
      });
  }

  deleteLot() {
    if (!this.lotId) return;
    if (!confirm('Are you sure you want to delete this parking lot?')) return;

    this.http.delete(`http://localhost:3000/lots/${this.lotId}`, {
      body: { adminName: "admin" }   // ✅ send adminName in DELETE body
    }).subscribe({
      next: () => {
        alert('Lot deleted successfully!');
        this.router.navigate(['/admin-dashboard']);
      },
      error: (err) => {
        console.error(err);
        alert('Error deleting lot');
      }
    });
  }
}
