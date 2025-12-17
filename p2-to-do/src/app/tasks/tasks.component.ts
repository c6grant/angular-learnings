import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, UsersService } from '../users/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Task, TasksService } from './tasks.service';
import { TaskComponent } from './task/task.component';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tasks',
  imports: [TaskComponent, CommonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit, OnDestroy {
  user: User | null = null;
  userId: string | null = null;
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  currentFilter: 'all' | 'pending' | 'completed' = 'all';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private usersService: UsersService,
    private tasksService: TasksService
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.userId = params['id'];
      this.loadUser();
      this.loadTasks();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUser() {
    if (this.userId) {
      const users = this.usersService.getUsers();
      this.user = users.find((user) => user.id === this.userId) || null;
    }
  }

  private loadTasks() {
    if (this.userId) {
      // Initialize sample tasks if none exist
      this.tasksService.initializeSampleTasks(this.userId);
      this.tasks = this.tasksService.getTasksByUserId(this.userId);
    }
  }

  onTaskSelect(task: Task) {
    this.selectedTask = task;
  }

  onTaskToggle(task: Task) {
    this.tasksService.updateTask(task.id, { completed: !task.completed });
    this.loadTasks(); // Refresh the list
    
    // Update selected task if it's the one being toggled
    if (this.selectedTask?.id === task.id) {
      this.selectedTask = { ...task, completed: !task.completed };
    }
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  setFilter(filter: 'all' | 'pending' | 'completed'): void {
    this.currentFilter = filter;
    // Clear selection when changing filters to avoid confusion
    this.selectedTask = null;
  }

  getFilteredTasks(): Task[] {
    switch (this.currentFilter) {
      case 'pending':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      default:
        return this.tasks;
    }
  }

  getCompletedCount(): number {
    return this.tasks.filter(task => task.completed).length;
  }

  getPendingCount(): number {
    return this.tasks.filter(task => !task.completed).length;
  }

  getOverdueCount(): number {
    return this.tasks.filter(task => this.isOverdue(task)).length;
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }
}
