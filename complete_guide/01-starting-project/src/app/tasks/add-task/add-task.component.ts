import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskService } from '../tasks.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {
  @Input({required: true}) userId!: string;
  @Output() close = new EventEmitter<void>();
  enteredTitle = '';
  enteredSummary = '';
  enteredDate = '';
  private taskService = inject(TaskService);

  onAddTask() {
    this.taskService.addTask({
      title: this.enteredTitle,
      summary: this.enteredSummary,
      dueDate: this.enteredDate,
    }, this.userId);
    this.close.emit();
  }
  onCancel() {
    // Logic to handle cancellation can be added here
    this.close.emit();
  }

}
