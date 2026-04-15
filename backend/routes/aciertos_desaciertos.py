from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from uuid import uuid4
from datetime import datetime

from models.aciertos_desaciertos import AciertosDesaciertos, AciertosDesaciertosCreate, AciertosDesaciertosUpdate
from middlewares.auth import db, get_current_active_user, require_manager_or_admin

router = APIRouter(prefix="/api/aciertos-desaciertos", tags=["aciertos-desaciertos"])

@router.get("", response_model=List[AciertosDesaciertos])
async def get_evaluaciones(
    month: Optional[int] = Query(None),
    year: Optional[int] = Query(None),
    department: Optional[str] = Query(None),
    employee_id: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_active_user)
):
    """Obtener evaluaciones de Aciertos y Desaciertos con filtros"""
    query = {}
    
    if month:
        query["month"] = month
    if year:
        query["year"] = year
    if department and department != "all":
        query["department"] = department
    if employee_id and employee_id != "all":
        query["evaluatedId"] = employee_id
    
    evaluaciones = await db.aciertos_desaciertos.find(query, {"_id": 0}).to_list(1000)
    return evaluaciones

@router.get("/{evaluation_id}", response_model=AciertosDesaciertos)
async def get_evaluacion(
    evaluation_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Obtener una evaluación por ID"""
    evaluacion = await db.aciertos_desaciertos.find_one({"id": evaluation_id}, {"_id": 0})
    if not evaluacion:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    return evaluacion

@router.post("", response_model=AciertosDesaciertos)
async def create_evaluacion(
    eval_data: AciertosDesaciertosCreate,
    current_user: dict = Depends(require_manager_or_admin)
):
    """Crear nueva evaluación de Aciertos y Desaciertos"""
    # Obtener datos del evaluador y evaluado
    evaluator = await db.employees.find_one({"id": eval_data.evaluatorId}, {"_id": 0})
    evaluated = await db.employees.find_one({"id": eval_data.evaluatedId}, {"_id": 0})
    
    if not evaluator or not evaluated:
        raise HTTPException(status_code=404, detail="Evaluator or evaluated employee not found")
    
    # Parsear fecha
    date_obj = datetime.fromisoformat(eval_data.date)
    quarter = f"Q{(date_obj.month - 1) // 3 + 1} {date_obj.year}"
    
    new_evaluation = {
        "id": str(uuid4()),
        "evaluatorId": eval_data.evaluatorId,
        "evaluatorName": evaluator["name"],
        "evaluatedId": eval_data.evaluatedId,
        "evaluatedName": evaluated["name"],
        "department": evaluated["department"],
        "date": eval_data.date,
        "month": date_obj.month,
        "year": date_obj.year,
        "quarter": quarter,
        "resultadoVsObjetivo": eval_data.resultadoVsObjetivo,
        "aciertosColaborador": eval_data.aciertosColaborador,
        "desaciertosColaborador": eval_data.desaciertosColaborador,
        "aciertosEmpresa": eval_data.aciertosEmpresa,
        "desaciertosEmpresa": eval_data.desaciertosEmpresa,
        "compromisos": [comp.dict() for comp in eval_data.compromisos],
        "created_at": datetime.now()
    }
    
    await db.aciertos_desaciertos.insert_one(new_evaluation)
    return new_evaluation

@router.put("/{evaluation_id}", response_model=AciertosDesaciertos)
async def update_evaluacion(
    evaluation_id: str,
    eval_data: AciertosDesaciertosUpdate,
    current_user: dict = Depends(require_manager_or_admin)
):
    """Actualizar evaluación"""
    update_data = {k: v for k, v in eval_data.dict().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    # Si se actualiza la fecha, actualizar month y year
    if "date" in update_data:
        date_obj = datetime.fromisoformat(update_data["date"])
        update_data["month"] = date_obj.month
        update_data["year"] = date_obj.year
        update_data["quarter"] = f"Q{(date_obj.month - 1) // 3 + 1} {date_obj.year}"
    
    result = await db.aciertos_desaciertos.update_one(
        {"id": evaluation_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    
    updated_evaluation = await db.aciertos_desaciertos.find_one({"id": evaluation_id}, {"_id": 0})
    return updated_evaluation

@router.delete("/{evaluation_id}")
async def delete_evaluacion(
    evaluation_id: str,
    current_user: dict = Depends(require_manager_or_admin)
):
    """Eliminar evaluación"""
    result = await db.aciertos_desaciertos.delete_one({"id": evaluation_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    
    return {"message": "Evaluation deleted successfully"}
