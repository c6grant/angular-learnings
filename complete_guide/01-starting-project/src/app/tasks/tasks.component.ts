import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export default class TasksComponent {
  @Input({required: true}) userId!: string;
  @Input({required: true}) name!: string;
  addTaskToggled: boolean = false;
  constructor(private taskService: TaskService) {}
  
  get selectedUserTasks() {
    return this.getUserTasks(this.userId);
  }

  getUserTasks(userId: string) {
    return this.taskService.getUserTasks(userId);
  }

  onAddTaskClicked() {
    this.addTaskToggled = true;
  }

  onCloseAddTask() {
    this.addTaskToggled = false;
  }
}
