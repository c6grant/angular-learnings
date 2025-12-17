import { inject, Injectable, signal } from '@angular/core';
import { Task, TaskStatus } from './task.model';
import { LoggingService } from '../logging.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private tasks = signal<Task[]>([]);
  allTasks = this.tasks.asReadonly();
  private loggingService = inject(LoggingService);

  addTask(taskData: { title: string; description: string }) {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(),
      status: 'OPEN',
    };
    this.tasks.update((oldTasks) => [...oldTasks, newTask]);
    this.loggingService.log(`Task added: ${newTask.title}`);
  }

  updateTaskStatus(taskID: string, newStatus: TaskStatus) {
    this.tasks.update((oldTasks) =>
      oldTasks.map((task) =>
        task.id === taskID ? { ...task, status: newStatus } : task
      )
    );
    this.loggingService.log(
      `Task updated: ID ${taskID} to status ${newStatus}`
    );
  }
}
