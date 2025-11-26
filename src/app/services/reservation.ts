import { Injectable } from '@angular/core';

export interface Reservation {
  id: number;
  destination: string;
  lotName: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'past';
}

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private selectedDestination = '';
  private selectedLot: any = null;
  private reservations: Reservation[] = [];
  private nextId = 1;

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
    this.reservations.push({
      id: this.nextId++,
      destination,
      lotName,
      startTime,
      endTime,
      status: 'active',
    });
  }

  getReservations(): Reservation[] {
    return this.reservations;
  }

  deleteReservation(id: number) {
    this.reservations = this.reservations.filter(r => r.id !== id);
  }

  // Very simple "change time" – just replaces times
  updateReservationTime(id: number, newStart: string, newEnd: string) {
    const r = this.reservations.find(x => x.id === id);
    if (r) {
      r.startTime = newStart;
      r.endTime = newEnd;
    }
  }
}
