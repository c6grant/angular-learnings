import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../tasks.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task',
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input() task!: Task;
  @Input() isSelected: boolean = false;
  @Output() taskClick = new EventEmitter<Task>();
  @Output() taskToggle = new EventEmitter<Task>();

  onTaskClick() {
    this.taskClick.emit(this.task);
  }

  onToggleComplete(event: Event) {
    event.stopPropagation(); // Prevent triggering task click
    this.taskToggle.emit(this.task);
  }

  getPriorityClass(): string {
    return `priority-${this.task.priority}`;
  }

  formatDueDate(): string {
    if (!this.task.dueDate) return 'No due date';
    
    const dueDate = new Date(this.task.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  }

  isOverdue(): boolean {
    if (!this.task.dueDate || this.task.completed) return false;
    return new Date(this.task.dueDate) < new Date();
  }
}
