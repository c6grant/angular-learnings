import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'add-expense-dialog',
  templateUrl: './add-expense-dialog.component.html',
  styleUrls: ['./add-expense-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    FormsModule
  ]
})
export class AddExpenseDialogComponent {
  expenseData: any = {
    description: '',
    amount: null,
    category_id: null,
    date_of_expense: new Date(),
    note: ''
  };

  constructor(
    public dialogRef: MatDialogRef<AddExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.isValid()) {
      // Format date to ISO string
      const expenseToSubmit = {
        ...this.expenseData,
        date_of_expense: new Date(this.expenseData.date_of_expense).toISOString()
      };
      this.dialogRef.close(expenseToSubmit);
    }
  }

  isValid(): boolean {
    return !!(
      this.expenseData.description &&
      this.expenseData.amount &&
      this.expenseData.category_id &&
      this.expenseData.date_of_expense
    );
  }
}
