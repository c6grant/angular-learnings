import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ControlComponent } from '../../../shared/control/control.component';
import { FormsModule } from '@angular/forms';
import { Ticket } from '../ticket.model';

@Component({
  selector: 'app-new-ticket',
  standalone: true,
  imports: [ButtonComponent, ControlComponent, FormsModule],
  templateUrl: './new-ticket.component.html',
  styleUrl: './new-ticket.component.css',
})
export class NewTicketComponent implements AfterViewInit {
  @ViewChild('form') form?: ElementRef<HTMLFormElement>;
  @Output() add = new EventEmitter<{ title: string; text: string }>();

  enteredTitle = '';
  enteredText = '';

  ngAfterViewInit() {
    console.log('AFTER VIEW INIT');
  }

  onSubmit() {
    // Handle form submission logic here
    console.log('Form submitted');
    // console.dir(titleInput);
    // console.dir(requestInput);
    this.add.emit({ title: this.enteredTitle, text: this.enteredText });
    this.form?.nativeElement.reset();
  }
}
