import { Routes } from '@angular/router';
import { UserListComponent } from './user-list.component';
import { AppointmentListComponent } from './appointment-list.component';

export const routes: Routes = [
  { path: 'users', component: UserListComponent },
  { path: 'appointments', component: AppointmentListComponent },
  { path: '', redirectTo: 'users', pathMatch: 'full' },
];
