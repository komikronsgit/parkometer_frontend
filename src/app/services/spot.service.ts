import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Spot {
  name: string;
  address?: string;
  hasSpecialTimings?: boolean;
  timingFrom?: string;
  timingTo?: string;
  isPaid?: boolean;
  pricePerHour?: number;
  lat?: number;
  lng?: number;
  createdBy?: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class SpotService {
  private apiUrl = 'http://localhost:3000/spots'; // Your backend endpoint

  constructor(private http: HttpClient) {}

  // Add new spot
  addSpot(spot: Spot): Observable<any> {
    return this.http.post(this.apiUrl, spot);
  }

  // Get all spots
  getSpots(): Observable<Spot[]> {
    return this.http.get<Spot[]>(this.apiUrl);
  }
}
