import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  async login(name: string, password: string): Promise<boolean> {
    try {
      await lastValueFrom(this.http.post('http://localhost:3000/users/confirm', { name, password }));
      this.currentUser = {
        name,
        email: 'user@provider.com',
        carType: 'Sedan',
        plate: 'ABC-123',
        isGuest: false,
      };
      return true;
    } catch (error) {
      return false;
    }
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
    
    this.http.post('http://localhost:3000/users', data).subscribe();
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
