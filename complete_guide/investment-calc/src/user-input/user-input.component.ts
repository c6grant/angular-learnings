import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserInputService } from './user-input.service';


@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css']
})
export class UserInputComponent {
  initialInvestment = 0;
  annualInvestment = 0;
  expectedReturn = 0;
  duration = 0;
  constructor(private userInputService: UserInputService) {}

  onCalculate() {
    const calculated = this.userInputService.calculateInvestment(
      this.initialInvestment,
      this.annualInvestment,
      this.expectedReturn,
      this.duration
    );
    console.log(calculated);
  }
}
