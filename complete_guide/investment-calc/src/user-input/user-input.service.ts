import { JsonpInterceptor } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class UserInputService {

    annualData: any[] = [];

    calculateInvestment(
        initialInvestment: number,
        yearlyContribution: number,
        expectedReturn: number,
        duration: number
    ) { 
        this.annualData = [];
        let investmentValue = initialInvestment;
    
        for (let i = 0; i < duration; i++) {
          const year = i + 1;
          const interestEarnedInYear = investmentValue * (expectedReturn / 100);
          investmentValue += interestEarnedInYear + yearlyContribution;
          const totalInterest =
            investmentValue - yearlyContribution * year - initialInvestment;
          this.annualData.push({
            year: year,
            interest: interestEarnedInYear,
            valueEndOfYear: investmentValue,
            annualInvestment: yearlyContribution,
            totalInterest: totalInterest,
            totalAmountInvested: initialInvestment + yearlyContribution * year,
          });
        }
    
        return this.annualData;
    }
}