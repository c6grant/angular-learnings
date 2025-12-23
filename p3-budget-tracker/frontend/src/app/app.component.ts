import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { LoginButtonComponent } from './components/login-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, LoginButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'p3-budget-tracker';
  protected auth = inject(AuthService);
}
