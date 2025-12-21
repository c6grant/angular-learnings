## Project 3 — Budget / Expense Tracker

**Why:** Similar complexity as the task manager but introduces more data structure (categories, amounts, maybe charts), and pushes you to manage more non-trivial state and maybe persist more complex data. This kind of project appears on Angular “intermediate” project lists.


**Requirements / Features**

- Users can add expense entries: amount, category (e.g. food, transport, entertainment), date, maybe description.
- Display a list (table or card-list) of expense entries.
- Show summary statistics: e.g. total spent this month, spending per category (pie or bar chart). For charts, you might integrate a charting library (like Chart.js, or any Angular-compatible chart library).
- Ability to filter expenses by date range (e.g. monthly), by category, etc.
- Persist data using local storage (or optionally, a simple backend/mock backend if you want to go further).
- Use good modular project structure: e.g. have a shared module (for common components), maybe a feature module for “expenses”.

**What you’ll practice:** More advanced state/data management within Angular, lists + dynamic updates, integration with external libraries (charting), modular architecture, forms, data persisting, maybe date handling.



## Needed screens: ##

Home Screen: loads a page w multiple tabs.
    (main one) has charts that can be modified/filtered (category, spender, etc)
        - "Top 5 expenses" or "Most frequent categories" widgets
        - have a chart that shows how close a given category is to reaching it's full budget (color code it depending on how close the user is)
        - Have pop up notifications upon login that serve as warnings
    (second one) displays the table of recorded expenses. This also has filters / sorting
        the table should have delete / update options
        maybe make this have multiple "drop-down" areas that constitute the current 2 week period
        this page should have a button for a pop-up "Add expense" page
            Allow the option for "projected expense" for future spendings that don't count as recurring

"Manage Categories" route
    allow user to define the categories they want
    User sets the bi-weekly budget for that category

"Recurring Expense" route
    User can define a given re-occuring expense
    It will then display on the "expense" tab but it will be grayed out and displayed in the correct cronological order as upcomming


## Models: ##

Expense
    id: int
    amount: float
    description: str
    category (FK): int
    note: str
    date_of_expense: datetime
    recurring_expense_id (FK): int (nullable)
    created_at: datetime
    updated_at: datetime
    
Category
    id: int
    category: str
    budget: float
    is_active: bool
    created_at: datetime

RecurringExpense
    id: int
    description: str
    amount: float
    category (FK): int
    frequency: str  # 'weekly', 'biweekly', 'monthly', 'yearly'
    start_date: datetime
    end_date: datetime (nullable)  # null = indefinite
    next_occurrence: datetime  # for efficient querying
    is_active: bool
    created_at: datetime
    updated_at: datetime







