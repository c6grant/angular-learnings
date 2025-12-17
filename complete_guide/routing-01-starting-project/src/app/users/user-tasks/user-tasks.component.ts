import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { UsersService } from '../users.service';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-user-tasks',
  standalone: true,
  templateUrl: './user-tasks.component.html',
  styleUrl: './user-tasks.component.css',
  imports: [RouterOutlet, RouterLink],
})
export class UserTasksComponent implements OnInit {
  // userId = input.required<string>();
  private usersService = inject(UsersService);
  private activatedRoute = inject(ActivatedRoute);
  userName = '';
  private destroyRef = inject(DestroyRef);

  // userName = computed(
  //   () =>
  //     this.usersService.users.find((u) => u.id === this.userId())?.name ??
  //     'Unknown User'
  // );

  ngOnInit() {
    console.log(this.activatedRoute);
    const subscription = this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const userId = params.get('userId');
        console.log('User ID from route params:', userId);
        this.userName =
          this.usersService.users.find((u) => u.id === userId)?.name ??
          'Unknown User';
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
