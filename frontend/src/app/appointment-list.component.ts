import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService, Appointment } from './services/appointment.service';
import { UserService, User } from './services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css'
})
export class AppointmentListComponent {
  appointments: Appointment[] = [];
  users: User[] = [];
  newAppointment: Partial<Appointment> = { serviceType: '', appointmentTime: '', user: undefined };
  editingId: number | null = null;
  loading = false;
  error = '';

  constructor(private appointmentService: AppointmentService, private userService: UserService) {
    this.loadAppointments();
    this.loadUsers();
  }

  loadAppointments() {
    this.loading = true;
    this.appointmentService.getAll().subscribe({
      next: appts => { this.appointments = appts; this.loading = false; },
      error: err => { this.error = 'Failed to load appointments'; this.loading = false; }
    });
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: users => { this.users = users; },
      error: err => { this.error = 'Failed to load users'; }
    });
  }

  addAppointment() {
    if (!this.newAppointment.serviceType || !this.newAppointment.appointmentTime || !this.newAppointment.user) return;
    this.appointmentService.add(this.newAppointment as Appointment).subscribe({
      next: appt => {
        this.appointments.push(appt);
        this.newAppointment = { serviceType: '', appointmentTime: '', user: undefined };
      },
      error: err => { this.error = 'Failed to add appointment'; }
    });
  }

  deleteAppointment(id?: number) {
    if (!id) return;
    this.appointmentService.delete(id).subscribe({
      next: () => { this.appointments = this.appointments.filter(a => a.id !== id); },
      error: err => { this.error = 'Failed to delete appointment'; }
    });
  }

  startEdit(appt: Appointment) {
    this.editingId = appt.id!;
    this.newAppointment = { ...appt };
  }

  updateAppointment() {
    if (!this.editingId || !this.newAppointment.serviceType || !this.newAppointment.appointmentTime || !this.newAppointment.user) return;
    this.appointmentService.update(this.editingId, this.newAppointment as Appointment).subscribe({
      next: appt => {
        const idx = this.appointments.findIndex(a => a.id === this.editingId);
        if (idx > -1) this.appointments[idx] = appt;
        this.editingId = null;
        this.newAppointment = { serviceType: '', appointmentTime: '', user: undefined };
      },
      error: err => { this.error = 'Failed to update appointment'; }
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.newAppointment = { serviceType: '', appointmentTime: '', user: undefined };
  }
}
