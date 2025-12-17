import { Component } from '@angular/core';
import HeaderComponent from './header/header.component';
import UserComponent from './user/user.component';
import { DUMMY_USERS } from './dummy-users';
import TasksComponent from './tasks/tasks.component';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  users = DUMMY_USERS;
  // selectedUser: { id: string; name: string; avatar: string; } | undefined = undefined;
  selectedUserId?: string;

  get selectedUser() {
    return this.users.find((user) => user.id === this.selectedUserId)!;
  }

  onSelectUser(id: string) {
    // this.selectedUser = this.users.find((user) => user.id === id);
    this.selectedUserId = id;
  }
}
