import { Directive, ElementRef, inject, Input } from '@angular/core';

@Directive({
  selector: 'a[appSafeLink]',
  standalone: true,
  host: {
    '(click)': 'onClick($event)',
  },
})
export class SafeLinkDirective {
  @Input('appSafeLink') appName: string = 'defaultApp';
  private hostElementRef = inject<ElementRef<HTMLAnchorElement>>(ElementRef);

  constructor() {
    console.log('SafeLinkDirective instantiated');
  }
  onClick(event: MouseEvent) {
    const wantsToLeave = window.confirm(
      'You are leaving the site. Do you want to continue?'
    );
    if (wantsToLeave) {
      const address = this.hostElementRef.nativeElement.href;
      this.hostElementRef.nativeElement.href =
        address + '?from=' + this.appName;
    }
  }
}
