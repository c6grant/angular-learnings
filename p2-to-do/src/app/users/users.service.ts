import { Injectable } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor() {}

  private readonly STORAGE_KEY = 'users';

  getUsers(): User[] {
    const usersJson = localStorage.getItem(this.STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }

  addUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  updateUser(
    id: string,
    updates: Partial<Omit<User, 'id' | 'createdAt'>>
  ): User | null {
    const users = this.getUsers();
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date(),
    };
    this.saveUsers(users);
    return users[index];
  }

  deleteUser(id: string): boolean {
    const users = this.getUsers();
    const filteredUsers = users.filter((user) => user.id !== id);
    if (filteredUsers.length === users.length) return false;

    this.saveUsers(filteredUsers);
    return true;
  }
}
