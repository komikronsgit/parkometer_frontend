import { Injectable } from '@angular/core';

export interface Reservation {
  id: number;
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

@Injectable({
  providedIn: 'root',
})
export class ReservationService {

  private selectedDestination = '';
  private selectedLot: ParkingLot | null = null;

  private reservations: Reservation[] = [];
  private nextId = 1;

  // -----------------------------
  // DESTINATION
  // -----------------------------
  setDestination(dest: string) {
    this.selectedDestination = dest;
  }

  getDestination(): string {
    return this.selectedDestination;
  }

  // -----------------------------
  // LOT SELECTED
  // -----------------------------
  setSelectedLot(lot: ParkingLot) {
    this.selectedLot = lot;
  }

  getSelectedLot(): ParkingLot | null {
    return this.selectedLot;
  }

  // -----------------------------
  // RESERVATIONS
  // -----------------------------
  addReservation(
    destination: string,
    lotName: string,
    startTime: string,
    endTime: string
  ) {
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

  updateReservationTime(id: number, newStart: string, newEnd: string) {
    const r = this.reservations.find(x => x.id === id);
    if (r) {
      r.startTime = newStart;
      r.endTime = newEnd;
    }
  }
}
