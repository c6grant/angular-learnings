import { NgModule } from "@angular/core";
import { TaskComponent } from "./task/task.component";
import { AddTaskComponent } from "./add-task/add-task.component";
import TasksComponent from "./tasks.component";
import { SharedModule } from "../shared/shared.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [TasksComponent, AddTaskComponent, TaskComponent],
  imports: [SharedModule, CommonModule, FormsModule],
  exports: [TasksComponent]
})
export class TasksModule {}