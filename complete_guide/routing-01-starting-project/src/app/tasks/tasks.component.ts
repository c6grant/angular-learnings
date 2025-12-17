import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';

import { TaskComponent } from './task/task.component';
import { Task } from './task/task.model';
import { TasksService } from './tasks.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  imports: [TaskComponent, RouterLink],
})
export class TasksComponent {
  userId = input.required<string>();
  // order = input<'asc' | 'desc'>();
  // order?: 'asc' | 'desc';
  order = signal<'asc' | 'desc'>('desc');
  private tasksService = inject(TasksService);
  userTasks = computed(() =>
    this.tasksService
      .allTasks()
      .filter((t) => t.userId === this.userId())
      .sort((a, b) => {
        if (this.order() === 'asc') {
          return a.id > b.id ? -1 : 1;
        } else {
          return a.id < b.id ? -1 : 1;
        }
      })
  );

  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const subscription = this.activatedRoute.queryParamMap.subscribe({
      next: (params) => {
        const orderParam = params.get('order');
        this.order.set(
          orderParam === 'asc' || orderParam === 'desc' ? orderParam : 'desc'
        );
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
