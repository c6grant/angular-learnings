import { Injectable } from '@angular/core';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly STORAGE_KEY = 'tasks';

  constructor() {}

  getTasks(): Task[] {
    const tasksJson = localStorage.getItem(this.STORAGE_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  }

  getTasksByUserId(userId: string): Task[] {
    return this.getTasks().filter(task => task.userId === userId);
  }

  getTaskById(id: string): Task | null {
    const tasks = this.getTasks();
    return tasks.find(task => task.id === id) || null;
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const tasks = this.getTasks();
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
    const tasks = this.getTasks();
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) return null;

    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date(),
    };
    this.saveTasks(tasks);
    return tasks[index];
  }

  deleteTask(id: string): boolean {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    if (filteredTasks.length === tasks.length) return false;

    this.saveTasks(filteredTasks);
    return true;
  }

  // Add some sample tasks for testing
  initializeSampleTasks(userId: string): void {
    const existingTasks = this.getTasksByUserId(userId);
    if (existingTasks.length === 0) {
      const sampleTasks = [
        {
          userId,
          title: 'Complete project proposal',
          description: 'Write and submit the Q1 project proposal document',
          completed: false,
          priority: 'high' as const,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        },
        {
          userId,
          title: 'Review team feedback',
          description: 'Go through all the feedback from last sprint review',
          completed: true,
          priority: 'medium' as const,
          dueDate: null,
        },
        {
          userId,
          title: 'Update documentation',
          description: 'Update the API documentation with recent changes',
          completed: false,
          priority: 'low' as const,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        },
      ];
      
      sampleTasks.forEach(task => this.addTask(task));
    }
  }
}