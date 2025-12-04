import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { AuthService } from './auth';

export interface Reservation {
  id: string;
  destination: string;
  lotName: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'past';
}

export interface ParkingLot {
  name: string;
  availableSpaces: number;
  distance: string;
}

export interface dbFormatReservation {
  _id: string;
  username: string;
  destination: string;
  lotName: string;
  startTime: Date;
  endTime: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private selectedDestination = '';
  private selectedLot: any = null;
  private reservations: Reservation[] = [];
  private nextId = 1;

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Destination & lot selection
  setDestination(dest: string) {
    this.selectedDestination = dest;
  }

  getDestination(): string {
    return this.selectedDestination;
  }

  setLot(lot: any) {
    this.selectedLot = lot;
  }

  getLot(): any {
    return this.selectedLot;
  }

  // Reservations
  addReservation(destination: string, lotName: string, startTime: string, endTime: string) {
    let startDate: Date = new Date(startTime);
    let endDate: Date = new Date(endTime);

    this.http.post<dbFormatReservation>('http://localhost:3000/reservations', {
      username: this.auth.getUser()?.name,
      destination,
      lotName,
      startTime: startDate,
      endTime: endDate,
    }).subscribe();
  }

  async getReservations(): Promise<Reservation[]> {
    const savedData = await lastValueFrom(this.http.get<dbFormatReservation[]>(
      `http://localhost:3000/reservations/user/${this.auth.getUser()?.name}`
    ));
    return savedData.map(r => ({
      id: r._id,
      destination: r.destination,
      lotName: r.lotName,
      startTime: r.startTime.toLocaleString(),
      endTime: r.endTime.toLocaleString(),
      status: r.endTime >= new Date() && new Date(r.startTime) <= new Date() ? 'active' : 'past',
    }));
  }

  deleteReservation(id: string) {
    this.http.delete(`http://localhost:3000/reservations/${id}`).subscribe();
  }

  // Very simple "change time" – just replaces times
  updateReservationTime(id: string, newStart: string, newEnd: string) {
    this.http.put(`http://localhost:3000/reservations/${id}`, {
      startTime: new Date(`2000-01-01 ${newStart}`),
      endTime: new Date(`2000-01-01 ${newEnd}`),
    }).subscribe();
  }

  async getLots(): Promise<ParkingLot[]> {
    return await lastValueFrom(this.http.get<ParkingLot[]>('http://localhost:3000/lots'));
  }
}
