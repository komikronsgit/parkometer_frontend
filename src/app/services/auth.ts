import { Injectable } from '@angular/core';

export interface User {
  name: string;
  email?: string;
  phone?: string;
  carType?: string;
  plate?: string;
  isGuest?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  login(email: string, password: string): boolean {
    // TODO: replace with real backend call later
    this.currentUser = {
      name: 'Packometer User',
      email,
      carType: 'Sedan',
      plate: 'ABC-123',
      isGuest: false,
    };
    return true;
  }

  signUp(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  plate?: string;
}) {
  this.currentUser = {
    name: data.name,
    email: data.email,
    phone: data.phone ?? '',
    plate: data.plate ?? '',
    isGuest: false,
    carType: 'Unknown',
  };

  return true;
}


  continueAsGuest(): void {
    this.currentUser = {
      name: 'Guest',
      isGuest: true,
    };
  }

  getUser(): User | null {
    return this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
  }
}
