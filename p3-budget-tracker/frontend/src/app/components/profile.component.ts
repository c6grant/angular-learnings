import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .profile-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      flex: 1;
    }

    .profile-name {
      font-size: 0.95rem;
      font-weight: 600;
      color: #f7fafc;
      letter-spacing: 0.01em;
    }

    .profile-email {
      font-size: 0.8rem;
      color: #a0aec0;
    }

    .profile-picture {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 2px solid rgba(99, 179, 237, 0.4);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .loading-text {
      color: #a0aec0;
      font-size: 0.9rem;
      font-style: italic;
    }
  `],
  template: `
    @if (auth.isLoading$ | async) {
      <div class="loading-text">Loading profile...</div>
    }

    @if ((auth.isAuthenticated$ | async) && (auth.user$ | async); as user) {
      <div class="profile-container">
        @if (user.picture) {
          <img
            [src]="user.picture"
            [alt]="user.name || 'User'"
            class="profile-picture"
          />
        }
        <div class="profile-info">
          <div class="profile-name">
            {{ user.name }}
          </div>
          <div class="profile-email">
            {{ user.email }}
          </div>
        </div>
      </div>
    }
  `
})
export class ProfileComponent {
  protected auth = inject(AuthService);
}
