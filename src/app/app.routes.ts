import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'location',
    loadComponent: () =>
      import('./pages/location/location.page').then((m) => m.LocationPage),
  },
  {
    path: 'lot',
    loadComponent: () =>
      import('./pages/lot/lot.page').then((m) => m.LotPage),
  },
  {
    path: 'account',
    loadComponent: () =>
      import('./pages/account/account.page').then((m) => m.AccountPage),
  },
  {
    path: 'reserve',
    loadComponent: () => import('./pages/reserve/reserve.page').then( m => m.ReservePage)
  }

];

