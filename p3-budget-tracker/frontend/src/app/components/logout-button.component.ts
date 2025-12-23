import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  styles: [`
    .logout-btn {
      width: 100%;
      padding: 0.85rem 1.5rem;
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: 8px;
      border: 2px solid #fc8181;
      background-color: transparent;
      color: #fc8181;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      outline: none;
      font-family: 'Inter', sans-serif;
    }

    .logout-btn:hover {
      background-color: #fc8181;
      color: #1a1e27;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(252, 129, 129, 0.4);
    }

    .logout-btn:active {
      transform: translateY(0);
    }
  `],
  template: `
    <button
      (click)="logout()"
      class="logout-btn"
    >
      Log Out
    </button>
  `
})
export class LogoutButtonComponent {
  private auth = inject(AuthService);

  logout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }
}
