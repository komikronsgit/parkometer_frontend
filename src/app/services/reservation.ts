import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { AuthService } from './auth';

export interface Reservation {
  id: string;
  destination: string;
  lotName: string;
  plate: string;
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
  plate: string;
  startTime: string;
  endTime: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private selectedDestination = '';
  private selectedLot: any = null;

  constructor(private http: HttpClient, private auth: AuthService) {}

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

  async addReservation(
    destination: string,
    lotName: string,
    plate: string,
    startTime: string,
    endTime: string
  ): Promise<dbFormatReservation> {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    return await lastValueFrom(
      this.http.post<dbFormatReservation>('http://localhost:3000/reservations', {
        username: this.auth.getUser()?.name,
        destination,
        lotName,
        plate,
        startTime: startDate,
        endTime: endDate,
      })
    );
  }

  async getReservations(): Promise<Reservation[]> {
    const savedData = await lastValueFrom(this.http.get<dbFormatReservation[]>(
      `http://localhost:3000/reservations/user/${this.auth.getUser()?.name}`
    ));

    return savedData.map(r => {
      const start = new Date(r.startTime);
      const end = new Date(r.endTime);
      const now = new Date();

      return {
        id: r._id,
        destination: r.destination,
        lotName: r.lotName,
        plate: r.plate,
        startTime: start.toLocaleString(),
        endTime: end.toLocaleString(),
        status: end >= now && start <= now ? 'active' : 'past',
      };
    });
  }

  deleteReservation(id: string) {
    this.http.delete(`http://localhost:3000/reservations/${id}`).subscribe();
  }

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