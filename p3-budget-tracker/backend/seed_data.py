from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from database import SessionLocal, engine
from models import Base, Category, Expense, RecurringExpense
import random

# Create tables
Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(Expense).delete()
        db.query(RecurringExpense).delete()
        db.query(Category).delete()
        db.commit()
        
        # Seed Categories
        categories = [
            Category(category="Groceries", budget=400.0, is_active=True, created_at=datetime.utcnow()),
            Category(category="Transportation", budget=200.0, is_active=True, created_at=datetime.utcnow()),
            Category(category="Entertainment", budget=150.0, is_active=True, created_at=datetime.utcnow()),
            Category(category="Utilities", budget=250.0, is_active=True, created_at=datetime.utcnow()),
            Category(category="Dining Out", budget=300.0, is_active=True, created_at=datetime.utcnow()),
            Category(category="Healthcare", budget=100.0, is_active=True, created_at=datetime.utcnow()),
            Category(category="Shopping", budget=200.0, is_active=True, created_at=datetime.utcnow()),
            Category(category="Subscriptions", budget=50.0, is_active=True, created_at=datetime.utcnow()),
        ]
        
        db.add_all(categories)
        db.commit()
        
        # Refresh to get IDs
        for cat in categories:
            db.refresh(cat)
        
        print(f"Seeded {len(categories)} categories")
        
        # Seed Recurring Expenses
        recurring_expenses = [
            RecurringExpense(
                description="Netflix Subscription",
                amount=15.99,
                category_id=categories[7].id,  # Subscriptions
                frequency="monthly",
                start_date=datetime(2024, 1, 1),
                end_date=None,
                next_occurrence=datetime.utcnow() + timedelta(days=5),
                is_active=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ),
            RecurringExpense(
                description="Spotify Premium",
                amount=10.99,
                category_id=categories[7].id,  # Subscriptions
                frequency="monthly",
                start_date=datetime(2024, 1, 15),
                end_date=None,
                next_occurrence=datetime.utcnow() + timedelta(days=12),
                is_active=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ),
            RecurringExpense(
                description="Electric Bill",
                amount=120.0,
                category_id=categories[3].id,  # Utilities
                frequency="monthly",
                start_date=datetime(2024, 1, 1),
                end_date=None,
                next_occurrence=datetime.utcnow() + timedelta(days=3),
                is_active=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ),
            RecurringExpense(
                description="Internet Service",
                amount=79.99,
                category_id=categories[3].id,  # Utilities
                frequency="monthly",
                start_date=datetime(2024, 1, 1),
                end_date=None,
                next_occurrence=datetime.utcnow() + timedelta(days=8),
                is_active=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ),
            RecurringExpense(
                description="Gym Membership",
                amount=45.0,
                category_id=categories[5].id,  # Healthcare
                frequency="monthly",
                start_date=datetime(2024, 1, 1),
                end_date=None,
                next_occurrence=datetime.utcnow() + timedelta(days=15),
                is_active=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ),
            RecurringExpense(
                description="Public Transit Pass",
                amount=100.0,
                category_id=categories[1].id,  # Transportation
                frequency="biweekly",
                start_date=datetime(2024, 1, 1),
                end_date=None,
                next_occurrence=datetime.utcnow() + timedelta(days=6),
                is_active=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ),
        ]
        
        db.add_all(recurring_expenses)
        db.commit()
        
        # Refresh to get IDs
        for rec in recurring_expenses:
            db.refresh(rec)
        
        print(f"Seeded {len(recurring_expenses)} recurring expenses")
        
        # Seed Expenses (last 60 days)
        expenses = []
        
        # Grocery expenses
        for i in range(20):
            days_ago = random.randint(0, 60)
            expenses.append(Expense(
                amount=round(random.uniform(30, 150), 2),
                description=random.choice(["Whole Foods", "Trader Joe's", "Safeway", "Costco", "Local Market"]),
                category_id=categories[0].id,
                note=random.choice(["Weekly shopping", "Quick stop", "Big haul", ""]),
                date_of_expense=datetime.utcnow() - timedelta(days=days_ago),
                recurring_expense_id=None,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ))
        
        # Transportation expenses
        for i in range(15):
            days_ago = random.randint(0, 60)
            expenses.append(Expense(
                amount=round(random.uniform(10, 60), 2),
                description=random.choice(["Gas", "Uber", "Lyft", "Parking", "Car Wash"]),
                category_id=categories[1].id,
                note="",
                date_of_expense=datetime.utcnow() - timedelta(days=days_ago),
                recurring_expense_id=None,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ))
        
        # Entertainment expenses
        for i in range(12):
            days_ago = random.randint(0, 60)
            expenses.append(Expense(
                amount=round(random.uniform(15, 80), 2),
                description=random.choice(["Movie Theater", "Concert", "Mini Golf", "Bowling", "Museum"]),
                category_id=categories[2].id,
                note=random.choice(["Weekend fun", "Date night", ""]),
                date_of_expense=datetime.utcnow() - timedelta(days=days_ago),
                recurring_expense_id=None,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ))
        
        # Dining Out expenses
        for i in range(25):
            days_ago = random.randint(0, 60)
            expenses.append(Expense(
                amount=round(random.uniform(12, 75), 2),
                description=random.choice(["Chipotle", "Local Pizza", "Thai Restaurant", "Sushi Place", "Coffee Shop", "Fast Food"]),
                category_id=categories[4].id,
                note="",
                date_of_expense=datetime.utcnow() - timedelta(days=days_ago),
                recurring_expense_id=None,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ))
        
        # Shopping expenses
        for i in range(10):
            days_ago = random.randint(0, 60)
            expenses.append(Expense(
                amount=round(random.uniform(25, 200), 2),
                description=random.choice(["Amazon", "Target", "Best Buy", "Clothing Store", "Home Goods"]),
                category_id=categories[6].id,
                note=random.choice(["New clothes", "Needed item", "Impulse buy", ""]),
                date_of_expense=datetime.utcnow() - timedelta(days=days_ago),
                recurring_expense_id=None,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ))
        
        # Add some expenses from recurring items (past occurrences)
        # Netflix - last 2 months
        for i in range(2):
            expenses.append(Expense(
                amount=15.99,
                description="Netflix Subscription",
                category_id=categories[7].id,
                note="Auto-generated from recurring",
                date_of_expense=datetime.utcnow() - timedelta(days=30 * (i + 1)),
                recurring_expense_id=recurring_expenses[0].id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ))
        
        # Electric Bill - last 2 months
        for i in range(2):
            expenses.append(Expense(
                amount=random.uniform(110, 130),
                description="Electric Bill",
                category_id=categories[3].id,
                note="Auto-generated from recurring",
                date_of_expense=datetime.utcnow() - timedelta(days=30 * (i + 1)),
                recurring_expense_id=recurring_expenses[2].id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ))
        
        db.add_all(expenses)
        db.commit()
        
        print(f"Seeded {len(expenses)} expenses")
        print("\nDatabase seeding completed successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
