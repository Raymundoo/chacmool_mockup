from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from uuid import uuid4
from datetime import datetime

from models.employee import Employee, EmployeeCreate, EmployeeUpdate
from middlewares.auth import db, get_current_active_user, require_manager_or_admin

router = APIRouter(prefix="/api/employees", tags=["employees"])

@router.get("", response_model=List[Employee])
async def get_employees(
    department: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_active_user)
):
    """Obtener todos los empleados"""
    query = {}
    if department and department != "all":
        query["department"] = department
    
    employees = await db.employees.find(query, {"_id": 0}).to_list(1000)
    return employees

@router.get("/{employee_id}", response_model=Employee)
async def get_employee(
    employee_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Obtener un empleado por ID"""
    employee = await db.employees.find_one({"id": employee_id}, {"_id": 0})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.post("", response_model=Employee)
async def create_employee(
    employee_data: EmployeeCreate,
    current_user: dict = Depends(require_manager_or_admin)
):
    """Crear nuevo empleado"""
    new_employee = {
        "id": str(uuid4()),
        "name": employee_data.name,
        "position": employee_data.position,
        "department": employee_data.department,
        "email": employee_data.email,
        "avatar": employee_data.avatar or f"https://api.dicebear.com/7.x/avataaars/svg?seed={employee_data.name}",
        "evaluations": {},
        "kpis_score": 0,
        "eval_360_score": 0,
        "category": "B1",
        "created_at": datetime.now()
    }
    
    await db.employees.insert_one(new_employee)
    return new_employee

@router.put("/{employee_id}", response_model=Employee)
async def update_employee(
    employee_id: str,
    employee_data: EmployeeUpdate,
    current_user: dict = Depends(require_manager_or_admin)
):
    """Actualizar empleado"""
    update_data = {k: v for k, v in employee_data.dict().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.employees.update_one(
        {"id": employee_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    updated_employee = await db.employees.find_one({"id": employee_id}, {"_id": 0})
    return updated_employee

@router.delete("/{employee_id}")
async def delete_employee(
    employee_id: str,
    current_user: dict = Depends(require_manager_or_admin)
):
    """Eliminar empleado"""
    result = await db.employees.delete_one({"id": employee_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return {"message": "Employee deleted successfully"}
