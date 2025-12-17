import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appLog]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class LogDirective {
  constructor() {}
  private elementRef = inject<ElementRef>(ElementRef);

  onClick() {
    console.log('Element clicked!');
    console.log(this.elementRef);
    console.log(this.elementRef.nativeElement);
  }
}
