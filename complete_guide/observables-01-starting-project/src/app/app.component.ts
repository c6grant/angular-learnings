import { Component, effect, OnInit, signal } from '@angular/core';
import { interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  clickCount = signal(0);

  constructor() {
    effect(() => {
      console.log('Button clicked', this.clickCount(), 'times');
    });
  }

  ngOnInit(): void {
    // interval(1000)
    //   .pipe(map((val) => val ** 2))
    //   .subscribe({
    //     next: (value) => console.log('Interval emitted value:', value),
    //   });
  }

  onClick() {
    this.clickCount.update((count) => count + 1);
  }
}
