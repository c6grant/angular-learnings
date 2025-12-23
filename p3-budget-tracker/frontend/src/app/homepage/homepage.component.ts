import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { JsonPipe, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
// Import Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import {
  MatSidenavContainer,
  MatSidenav,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatNavList, MatDivider, MatListItem } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CurrencyPipe } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { AddExpenseDialogComponent } from '../add-expense-dialog/add-expense-dialog.component';
import { ProfileComponent } from '../components/profile.component';
import { LogoutButtonComponent } from '../components/logout-button.component';

interface Expense {
  id: number;
  amount: number;
  description: string;
  category_id: number;
  category_name: string;
  note: string;
  date_of_expense: string;
  recurring_expense_id: number | null;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  category: string;
  budget: number;
  is_active: boolean;
  created_at: string;
}

interface PayPeriod {
  title: string;
  startDate: Date;
  endDate: Date;
  expenses: Expense[];
  total: number;
}

@Component({
  selector: 'app-homepage',
  imports: [
    DatePipe,
    MatSlideToggleModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabGroup,
    MatTab,
    MatSidenavContainer,
    MatSidenav,
    MatNavList,
    MatListItem,
    MatDivider,
    MatSidenavContent,
    MatTableModule,
    CurrencyPipe,
    FormsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatExpansionModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ProfileComponent,
    LogoutButtonComponent,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent implements OnInit {
  expenses: Expense[] = [];
  categories: Category[] = [];
  payPeriods: PayPeriod[] = [];
  futurePeriods: PayPeriod[] = [];
  currentPeriod: PayPeriod | null = null;
  pastPeriods: PayPeriod[] = [];
  displayedColumns: string[] = [
    'date_of_expense',
    'description',
    'amount',
    'category_name',
    'note',
  ];
  sidenavOpened = false;
  chart: Chart | null = null;
  spendingTrendChart: Chart | null = null;
  editingExpenseId: number | null = null;
  editingCategoryId: number | null = null;
  originalNoteValue: string = '';
  selectedTabIndex = 0;
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | null = null;
  @ViewChild('expenseChart') expenseChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('spendingTrendChart') spendingTrendChartRef?: ElementRef<HTMLCanvasElement>;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    // Register Chart.js components
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.getCategories();

    // Read query params to set initial tab and sort
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab === 'expenses') {
        this.selectedTabIndex = 1;
      } else {
        this.selectedTabIndex = 0;
      }

      // Read sort params
      this.sortColumn = params['sortColumn'] || null;
      this.sortDirection = params['sortDirection'] || null;

      // Apply sorting if params exist and expenses are loaded
      if (this.sortColumn && this.sortDirection && this.expenses.length > 0) {
        this.applySorting();
      }
    });

    this.getExpenses();
  }

  getCategories() {
    this.http.get<Category[]>('http://localhost:8000/categories/').subscribe({
      next: (response) => {
        this.categories = response;
        this.updateChart();
        this.updateSpendingTrendChart();
      },
      error: (error) => console.error('Error fetching categories:', error),
    });
  }

  getExpenses() {
    this.http.get<Expense[]>('http://localhost:8000/expenses/').subscribe({
      next: (response) => {
        this.expenses = response;
        // Apply sorting if it exists
        if (this.sortColumn && this.sortDirection) {
          this.applySorting();
        }
        this.groupExpensesByPayPeriod();
        this.updateChart();
        this.updateSpendingTrendChart();
      },
      error: (error) => console.error('Error fetching expenses:', error),
    });
  }

  groupExpensesByPayPeriod() {
    // Group expenses by month and pay period
    const periodMap = new Map<string, Expense[]>();

    this.expenses.forEach(expense => {
      const date = new Date(expense.date_of_expense);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      // Determine pay period: 1-14 or 15-end of month
      const isFirstHalf = day <= 14;
      const periodKey = `${year}-${month}-${isFirstHalf ? 'first' : 'second'}`;

      if (!periodMap.has(periodKey)) {
        periodMap.set(periodKey, []);
      }
      periodMap.get(periodKey)!.push(expense);
    });

    // Convert map to array of PayPeriod objects
    this.payPeriods = Array.from(periodMap.entries())
      .map(([key, expenses]) => {
        const [year, month, half] = key.split('-');
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

        const startDate = new Date(yearNum, monthNum, half === 'first' ? 1 : 15);
        const endDate = half === 'first'
          ? new Date(yearNum, monthNum, 14, 23, 59, 59)
          : new Date(yearNum, monthNum + 1, 0, 23, 59, 59); // Last day of month

        const monthName = startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const title = `${monthName} - ${half === 'first' ? '1st to 14th' : '15th to End'}`;

        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        return {
          title,
          startDate,
          endDate,
          expenses,
          total
        };
      })
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime()); // Most recent first

    // Categorize periods into future, current, and past
    const now = new Date();
    this.futurePeriods = [];
    this.currentPeriod = null;
    this.pastPeriods = [];

    this.payPeriods.forEach(period => {
      if (now >= period.startDate && now <= period.endDate) {
        // Current period
        this.currentPeriod = period;
      } else if (now < period.startDate) {
        // Future period
        this.futurePeriods.push(period);
      } else {
        // Past period
        this.pastPeriods.push(period);
      }
    });

    // Sort future periods (earliest first)
    this.futurePeriods.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    // Past periods already sorted (most recent first)
  }

  updateChart() {
    // Calculate total expenditure per category
    const categoryTotals = new Map<string, number>();

    this.expenses.forEach(expense => {
      const category = expense.category_name;
      const current = categoryTotals.get(category) || 0;
      categoryTotals.set(category, current + expense.amount);
    });

    // Prepare data for chart
    const labels = Array.from(categoryTotals.keys());
    const data = Array.from(categoryTotals.values());

    // Create budget map for easy lookup
    const budgetMap = new Map<string, number>();
    this.categories.forEach(cat => {
      budgetMap.set(cat.category, cat.budget);
    });

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    // Create new chart
    if (this.expenseChart?.nativeElement) {
      const ctx = this.expenseChart.nativeElement.getContext('2d');
      if (ctx) {
        // Custom plugin to draw budget lines
        const budgetLinePlugin = {
          id: 'budgetLines',
          afterDatasetsDraw: (chart: any) => {
            const ctx = chart.ctx;
            const xAxis = chart.scales['x'];
            const yAxis = chart.scales['y'];

            ctx.save();
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 5]);

            labels.forEach((label, index) => {
              const budget = budgetMap.get(label);
              if (budget !== undefined && budget > 0) {
                const y = yAxis.getPixelForValue(budget);
                const barWidth = xAxis.width / labels.length;
                const centerX = xAxis.getPixelForValue(index);
                const leftX = centerX - barWidth * 0.4;
                const rightX = centerX + barWidth * 0.4;

                ctx.beginPath();
                ctx.moveTo(leftX, y);
                ctx.lineTo(rightX, y);
                ctx.stroke();
              }
            });

            ctx.restore();
          }
        };

        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Total Expenditure',
              data: data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(199, 199, 199, 0.7)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(199, 199, 199, 1)',
              ],
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context: any) {
                    const value = context.parsed.y ?? 0;
                    const categoryLabel = context.label;
                    const budget = budgetMap.get(categoryLabel);

                    const lines = ['Spent: $' + value.toLocaleString()];
                    if (budget !== undefined && budget > 0) {
                      lines.push('Budget: $' + budget.toLocaleString());
                    }
                    return lines;
                  }
                }
              }
            }
          },
          plugins: [budgetLinePlugin]
        });
      }
    }
  }

  updateSpendingTrendChart() {
    // Group expenses by date and calculate daily totals
    const dailyTotals = new Map<string, number>();

    this.expenses.forEach(expense => {
      const date = expense.date_of_expense.split('T')[0]; // Get just the date part
      const current = dailyTotals.get(date) || 0;
      dailyTotals.set(date, current + expense.amount);
    });

    // Sort dates and prepare data
    const sortedDates = Array.from(dailyTotals.keys()).sort();
    const sortedAmounts = sortedDates.map(date => dailyTotals.get(date) || 0);

    // Destroy existing chart if it exists
    if (this.spendingTrendChart) {
      this.spendingTrendChart.destroy();
    }

    // Create new chart
    if (this.spendingTrendChartRef?.nativeElement) {
      const ctx = this.spendingTrendChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.spendingTrendChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: sortedDates.map(date => {
              const d = new Date(date + 'T00:00:00');
              return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }),
            datasets: [{
              label: 'Daily Spending',
              data: sortedAmounts,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              pointBorderColor: '#fff',
              pointBorderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context: any) {
                    const value = context.parsed.y ?? 0;
                    return 'Spent: $' + value.toLocaleString();
                  }
                }
              }
            }
          }
        });
      }
    }
  }

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
    const queryParams = index === 1 ? { tab: 'expenses' } : { tab: 'dashboard' };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  startEditingNote(expenseId: number) {
    this.editingExpenseId = expenseId;
    // Store the original note value
    const expense = this.expenses.find(e => e.id === expenseId);
    if (expense) {
      this.originalNoteValue = expense.note || '';
    }
    // Focus the input after the view updates
    setTimeout(() => {
      const input = document.querySelector('.note-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 0);
  }

  stopEditingNote() {
    if (this.editingExpenseId !== null) {
      const expense = this.expenses.find(e => e.id === this.editingExpenseId);
      if (expense) {
        const currentNote = expense.note || '';
        // Only send update if the note actually changed
        if (currentNote !== this.originalNoteValue) {
          this.http.put(`http://localhost:8000/expenses/${expense.id}`, {
            note: expense.note
          }).subscribe({
            next: (response) => {
              this.snackBar.open(`${expense.description} note updated successfully`, 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              });
            },
            error: (error) => {
              console.error('Error updating note:', error);
              this.snackBar.open('Error updating note', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              });
            }
          });
        }
      }
    }
    this.editingExpenseId = null;
    this.originalNoteValue = '';
  }

  isEditingNote(expenseId: number): boolean {
    return this.editingExpenseId === expenseId;
  }

  startEditingCategory(expenseId: number) {
    this.editingCategoryId = expenseId;
  }

  stopEditingCategory(expense: Expense) {
    if (this.editingCategoryId !== null) {
      // Send update to backend
      this.http.put(`http://localhost:8000/expenses/${expense.id}`, {
        category_id: expense.category_id
      }).subscribe({
        next: (response: any) => {
          // Update the category_name in the local expense object
          expense.category_name = response.category_name;
          this.snackBar.open(`${expense.description} category updated successfully`, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          // Refresh chart to reflect category change
          this.updateChart();
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.snackBar.open('Error updating category', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      });
    }
    this.editingCategoryId = null;
  }

  isEditingCategory(expenseId: number): boolean {
    return this.editingCategoryId === expenseId;
  }

  onSort(column: string) {
    // Cycle through: null -> asc -> desc -> null
    if (this.sortColumn !== column) {
      // New column, start with asc
      this.sortColumn = column;
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      // Same column, change to desc
      this.sortDirection = 'desc';
    } else if (this.sortDirection === 'desc') {
      // Same column, remove sort
      this.sortColumn = null;
      this.sortDirection = null;
    }

    // Update URL
    const queryParams: any = {};
    if (this.selectedTabIndex === 1) {
      queryParams.tab = 'expenses';
    } else {
      queryParams.tab = 'dashboard';
    }

    if (this.sortColumn && this.sortDirection) {
      queryParams.sortColumn = this.sortColumn;
      queryParams.sortDirection = this.sortDirection;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });

    // Apply sorting
    this.applySorting();
  }

  applySorting() {
    if (!this.sortColumn || !this.sortDirection) {
      // No sorting, could restore original order or leave as is
      return;
    }

    this.expenses = [...this.expenses].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortColumn) {
        case 'date_of_expense':
          aValue = new Date(a.date_of_expense).getTime();
          bValue = new Date(b.date_of_expense).getTime();
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'category_name':
          aValue = a.category_name?.toLowerCase() || '';
          bValue = b.category_name?.toLowerCase() || '';
          break;
        case 'note':
          aValue = a.note?.toLowerCase() || '';
          bValue = b.note?.toLowerCase() || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    // Re-group expenses after sorting
    this.groupExpensesByPayPeriod();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return '';
    }
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  openAddExpenseDialog() {
    const dialogRef = this.dialog.open(AddExpenseDialogComponent, {
      width: '500px',
      data: { categories: this.categories }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Create new expense via API
        this.http.post('http://localhost:8000/expenses/', result).subscribe({
          next: (response) => {
            this.snackBar.open('Expense added successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
            // Refresh expenses
            this.getExpenses();
          },
          error: (error) => {
            console.error('Error adding expense:', error);
            this.snackBar.open('Error adding expense', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          }
        });
      }
    });
  }
}
