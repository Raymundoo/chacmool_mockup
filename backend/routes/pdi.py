from fastapi import APIRouter, HTTPException, Depends
from middlewares.auth import get_current_user, db
from datetime import datetime
from uuid import uuid4

router = APIRouter(prefix="/api/pdi", tags=["PDI"])

@router.post("/create-simple")
async def create_simple_pdi(
    data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Create a simple PDI"""
    employee_id = data.get("employeeId", current_user.get("employee_id"))
    
    # Get employee
    employee = await db.employees.find_one({"id": employee_id}, {"_id": 0})
    if not employee:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    
    pdi = {
        "id": str(uuid4()),
        "employeeId": employee_id,
        "employeeName": employee["name"],
        "department": employee.get("area", "N/A"),
        "period": data.get("period", "Q1 2024"),
        "objetivos": data.get("objetivos", []),
        "aprendizajeFormal": data.get("aprendizajeFormal", ""),
        "aprendizajeInformal": data.get("aprendizajeInformal", ""),
        "mentorias": data.get("mentorias", ""),
        "status": "En Progreso",
        "created_at": datetime.now()
    }
    
    await db.pdis.insert_one(pdi)
    return pdi
