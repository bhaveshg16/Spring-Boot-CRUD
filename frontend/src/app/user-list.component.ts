import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from './services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  users: User[] = [];
  newUser: User = { name: '', email: '' };
  loading = false;
  error = '';

  constructor(private userService: UserService) {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: users => { this.users = users; this.loading = false; },
      error: err => { this.error = 'Failed to load users'; this.loading = false; }
    });
  }

  addUser() {
    if (!this.newUser.name.trim() || !this.newUser.email.trim()) return;
    this.userService.add(this.newUser).subscribe({
      next: user => {
        this.users.push(user);
        this.newUser = { name: '', email: '' };
      },
      error: err => { this.error = 'Failed to add user'; }
    });
  }

  deleteUser(id?: number) {
    if (!id) return;
    this.userService.delete(id).subscribe({
      next: () => { this.users = this.users.filter(u => u.id !== id); },
      error: err => { this.error = 'Failed to delete user'; }
    });
  }
}
