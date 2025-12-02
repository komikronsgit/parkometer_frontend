import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('../app/pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('../app/pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'location',
    loadComponent: () =>
      import('../app/pages/location/location.page').then((m) => m.LocationPage),
  },
  {
    path: 'lot',
    loadComponent: () =>
      import('../app/pages/lot/lot.page').then((m) => m.LotPage),
  },
  {
    path: 'account',
    loadComponent: () =>
      import('../app/pages/account/account.page').then((m) => m.AccountPage),
  },
  {
    path: 'add-spot',
    loadComponent: () =>
      import('../app/pages/add-spot/add-spot.page').then((m) => m.AddSpotPage),
  },
  { path: '**', redirectTo: 'login' },
];
