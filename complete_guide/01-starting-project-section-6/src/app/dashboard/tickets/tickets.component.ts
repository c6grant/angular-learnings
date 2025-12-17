import { Component } from '@angular/core';
import { NewTicketComponent } from './new-ticket/new-ticket.component';
import { Ticket } from './ticket.model';
import { NgFor, NgIf } from '@angular/common';
import { TicketComponent } from './ticket/ticket.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [NewTicketComponent, NgFor, NgIf, TicketComponent],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css',
})
export class TicketsComponent {
  tickets: Ticket[] = [];

  onAdd(ticketData: { title: string; text: string }) {
    const ticket: Ticket = {
      id: Math.random().toString(),
      title: ticketData.title,
      request: ticketData.text,
      status: 'open',
    };
    this.tickets.push(ticket);
  }
  onCloseTicket(ticketId: string) {
    const ticketIndex = this.tickets.findIndex((t) => t.id === ticketId);
    if (ticketIndex !== -1) {
      this.tickets[ticketIndex].status = 'closed';
    }
  }
}
