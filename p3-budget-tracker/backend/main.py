from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from typing import List
from datetime import datetime

from database import get_db
import models
import schemas

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/categories/", response_model=List[schemas.CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Category).filter(models.Category.is_active == True).all()
    return categories

@app.get("/expenses/", response_model=List[schemas.ExpenseResponse])
def get_expenses(db: Session = Depends(get_db)):
    expenses = db.query(models.Expense).options(joinedload(models.Expense.category)).all()
    
    # Debug first expense
    if expenses:
        first = expenses[0]
        print(f"DEBUG - First expense ID: {first.id}")
        print(f"DEBUG - Category ID: {first.category_id}")
        print(f"DEBUG - Category object: {first.category}")
        print(f"DEBUG - Has category attr: {hasattr(first, 'category')}")
        if first.category:
            print(f"DEBUG - Category name: {first.category.category}")
    
    return [{
        "id": e.id,
        "amount": e.amount,
        "description": e.description,
        "category_id": e.category_id,
        "category_name": e.category.category if e.category else None,
        "note": e.note,
        "date_of_expense": e.date_of_expense,
        "recurring_expense_id": e.recurring_expense_id,
        "created_at": e.created_at,
        "updated_at": e.updated_at
    } for e in expenses]

@app.post("/expenses/", response_model=schemas.ExpenseResponse, status_code=201)
def create_expense(
    expense: schemas.ExpenseCreate,
    db: Session = Depends(get_db)
):
    # Verify category exists
    category = db.query(models.Category).filter(models.Category.id == expense.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Create new expense
    new_expense = models.Expense(
        amount=expense.amount,
        description=expense.description,
        category_id=expense.category_id,
        note=expense.note,
        date_of_expense=expense.date_of_expense,
        recurring_expense_id=expense.recurring_expense_id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    
    # Load category for response
    db.refresh(new_expense, ["category"])
    
    return {
        "id": new_expense.id,
        "amount": new_expense.amount,
        "description": new_expense.description,
        "category_id": new_expense.category_id,
        "category_name": new_expense.category.category if new_expense.category else None,
        "note": new_expense.note,
        "date_of_expense": new_expense.date_of_expense,
        "recurring_expense_id": new_expense.recurring_expense_id,
        "created_at": new_expense.created_at,
        "updated_at": new_expense.updated_at
    }

@app.put("/expenses/{expense_id}", response_model=schemas.ExpenseResponse)
def update_expense(
    expense_id: int,
    expense_update: schemas.ExpenseUpdate,
    db: Session = Depends(get_db)
):
    # Find the expense
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    # Update only the fields that are provided
    update_data = expense_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(expense, field, value)
    
    # Update the updated_at timestamp
    expense.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(expense)
    
    # Load category for response
    db.refresh(expense, ["category"])
    
    return {
        "id": expense.id,
        "amount": expense.amount,
        "description": expense.description,
        "category_id": expense.category_id,
        "category_name": expense.category.category if expense.category else None,
        "note": expense.note,
        "date_of_expense": expense.date_of_expense,
        "recurring_expense_id": expense.recurring_expense_id,
        "created_at": expense.created_at,
        "updated_at": expense.updated_at
    }

