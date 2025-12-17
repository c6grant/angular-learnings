import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';
import { UsersService, User } from './users.service';
import { RouterOutlet, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-users',
  imports: [UserComponent, FormsModule, RouterOutlet],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  isModalOpen = false;
  hasChildRoute = false;
  newUser = {
    name: '',
    email: '',
  };

  constructor(
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Listen for route changes to detect child routes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Check if we're on a child route by looking at the URL
        this.hasChildRoute = event.urlAfterRedirects !== '/users';
        console.log('Navigation to:', event.urlAfterRedirects, 'hasChildRoute:', this.hasChildRoute);
      });
  }

  ngOnInit() {
    this.loadUsers();
    // Check initial route state
    this.hasChildRoute = this.router.url !== '/users';
    console.log('Initial URL:', this.router.url, 'hasChildRoute:', this.hasChildRoute);
  }

  private loadUsers() {
    this.users = this.usersService.getUsers();

    // If no users exist, add some sample users
    if (this.users.length === 0) {
      this.usersService.addUser({
        name: 'John Doe',
        email: 'john@example.com',
      });
      this.usersService.addUser({
        name: 'Jane Smith',
        email: 'jane@example.com',
      });
      this.users = this.usersService.getUsers();
    }
  }

  openAddUserModal() {
    this.isModalOpen = true;
    this.resetForm();
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  onSubmit() {
    if (this.newUser.name && this.newUser.email) {
      this.usersService.addUser(this.newUser);
      this.loadUsers();
      this.closeModal();
    }
  }

  private resetForm() {
    this.newUser = {
      name: '',
      email: '',
    };
  }
}
