from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class CategoryResponse(BaseModel):
    id: int
    category: str
    budget: float
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ExpenseCreate(BaseModel):
    amount: float
    description: str
    category_id: int
    note: Optional[str] = None
    date_of_expense: datetime
    recurring_expense_id: Optional[int] = None
    
    class Config:
        from_attributes = True

class ExpenseUpdate(BaseModel):
    amount: Optional[float] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    note: Optional[str] = None
    date_of_expense: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ExpenseResponse(BaseModel):
    id: int
    amount: float
    description: str
    category_id: int
    category_name: Optional[str] = None
    note: Optional[str] = None
    date_of_expense: datetime
    recurring_expense_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

