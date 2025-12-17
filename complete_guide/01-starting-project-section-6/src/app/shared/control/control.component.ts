import {
  afterRender,
  Component,
  ContentChild,
  ElementRef,
  inject,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [],
  templateUrl: './control.component.html',
  styleUrl: './control.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'control',
  },
})
export class ControlComponent {
  constructor() {
    afterRender(() => {
      console.log('AFTER RENDER');
    });
  }

  private el = inject(ElementRef);
  @Input({ required: true }) label!: string;
  @ContentChild('input') private control?: ElementRef<
    HTMLInputElement | HTMLTextAreaElement
  >;

  onClick() {
    console.log('Clicked!');
    console.log(this.el);
    console.log(this.control);
  }
}
