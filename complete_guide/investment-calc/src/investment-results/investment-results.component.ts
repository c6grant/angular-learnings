import { Component } from '@angular/core';
import { UserInputService } from '../user-input/user-input.service';
import { CurrencyPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-investment-results',
  standalone: true,
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './investment-results.component.html',
  styleUrls: ['./investment-results.component.css']
})
export class InvestmentResultsComponent {
  constructor(public userInputService: UserInputService) {}
}
