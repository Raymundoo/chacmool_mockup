from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models.kpi import (
    KPITemplate, KPITemplateCreate,
    KPIAssignment, KPIAssignmentCreate,
    KPIEvaluation, KPIEvaluationCreate
)
from middlewares.auth import get_current_user, db
from datetime import datetime
from uuid import uuid4

router = APIRouter(prefix="/api/kpis", tags=["KPIs"])

# ============== KPI TEMPLATES ==============

@router.get("/templates", response_model=List[KPITemplate])
async def get_kpi_templates(current_user: dict = Depends(get_current_user)):
    """Obtener todas las plantillas de KPIs"""
    templates = await db.kpi_templates.find({}, {"_id": 0}).to_list(1000)
    return templates

@router.get("/templates/{template_id}", response_model=KPITemplate)
async def get_kpi_template(template_id: str, current_user: dict = Depends(get_current_user)):
    """Obtener una plantilla específica"""
    template = await db.kpi_templates.find_one({"id": template_id}, {"_id": 0})
    if not template:
        raise HTTPException(status_code=404, detail="Plantilla no encontrada")
    return template

@router.post("/templates", response_model=KPITemplate)
async def create_kpi_template(
    template_data: KPITemplateCreate,
    current_user: dict = Depends(get_current_user)
):
    """Crear nueva plantilla de KPIs (solo admin/manager)"""
    if current_user["role"] not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    new_template = KPITemplate(
        id=str(uuid4()),
        **template_data.dict(),
        created_at=datetime.now()
    )
    await db.kpi_templates.insert_one(new_template.dict())
    return new_template

@router.put("/templates/{template_id}", response_model=KPITemplate)
async def update_kpi_template(
    template_id: str,
    template_data: KPITemplateCreate,
    current_user: dict = Depends(get_current_user)
):
    """Actualizar plantilla de KPIs"""
    if current_user["role"] not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    updated = await db.kpi_templates.update_one(
        {"id": template_id},
        {"$set": template_data.dict()}
    )
    if updated.matched_count == 0:
        raise HTTPException(status_code=404, detail="Plantilla no encontrada")
    
    template = await db.kpi_templates.find_one({"id": template_id}, {"_id": 0})
    return template

@router.delete("/templates/{template_id}")
async def delete_kpi_template(
    template_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Eliminar plantilla de KPIs"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores")
    
    result = await db.kpi_templates.delete_one({"id": template_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Plantilla no encontrada")
    return {"message": "Plantilla eliminada"}

# ============== KPI ASSIGNMENTS ==============

@router.get("/assignments", response_model=List[KPIAssignment])
async def get_kpi_assignments(current_user: dict = Depends(get_current_user)):
    """Obtener todas las asignaciones de KPIs"""
    # Si es empleado, solo ver sus asignaciones
    if current_user["role"] == "empleado":
        # Asumimos que current_user tiene un campo employeeId
        assignments = await db.kpi_assignments.find(
            {"employeeId": current_user.get("employeeId", "")},
            {"_id": 0}
        ).to_list(1000)
    else:
        assignments = await db.kpi_assignments.find({}, {"_id": 0}).to_list(1000)
    return assignments

@router.post("/assignments", response_model=KPIAssignment)
async def create_kpi_assignment(
    assignment_data: KPIAssignmentCreate,
    current_user: dict = Depends(get_current_user)
):
    """Asignar plantilla KPI a un empleado"""
    if current_user["role"] not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    
    # Obtener template y employee info
    template = await db.kpi_templates.find_one({"id": assignment_data.templateId}, {"_id": 0})
    employee = await db.employees.find_one({"id": assignment_data.employeeId}, {"_id": 0})
    
    if not template:
        raise HTTPException(status_code=404, detail="Plantilla no encontrada")
    if not employee:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    
    new_assignment = KPIAssignment(
        id=str(uuid4()),
        templateId=assignment_data.templateId,
        templateNombre=template["nombre"],
        employeeId=assignment_data.employeeId,
        employeeName=employee["name"],
        area=employee["area"],
        periodo=assignment_data.periodo,
        assignedDate=datetime.now().strftime("%Y-%m-%d"),
        created_at=datetime.now()
    )
    
    await db.kpi_assignments.insert_one(new_assignment.dict())
    return new_assignment

@router.delete("/assignments/{assignment_id}")
async def delete_kpi_assignment(
    assignment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Eliminar asignación de KPI"""
    if current_user["role"] not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    result = await db.kpi_assignments.delete_one({"id": assignment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Asignación no encontrada")
    return {"message": "Asignación eliminada"}

# ============== KPI EVALUATIONS ==============

@router.get("/evaluations", response_model=List[KPIEvaluation])
async def get_kpi_evaluations(current_user: dict = Depends(get_current_user)):
    """Obtener todas las evaluaciones de KPIs"""
    
    if current_user["role"] == "empleado":
        evaluations = await db.kpi_evaluations.find(
            {"employeeId": current_user.get("employeeId", "")},
            {"_id": 0}
        ).to_list(1000)
    else:
        evaluations = await db.kpi_evaluations.find({}, {"_id": 0}).to_list(1000)
    
    return evaluations

@router.post("/evaluations", response_model=KPIEvaluation)
async def create_kpi_evaluation(
    eval_data: KPIEvaluationCreate,
    current_user: dict = Depends(get_current_user)
):
    """Crear evaluación de KPIs"""
    if current_user["role"] not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    
    # Obtener assignment
    assignment = await db.kpi_assignments.find_one({"id": eval_data.assignmentId}, {"_id": 0})
    if not assignment:
        raise HTTPException(status_code=404, detail="Asignación no encontrada")
    
    # Calcular score total ponderado
    total_score = 0
    for metrica in eval_data.metricas:
        total_score += (metrica.valorObtenido * metrica.peso) / 100
    
    new_evaluation = KPIEvaluation(
        id=str(uuid4()),
        assignmentId=eval_data.assignmentId,
        employeeId=assignment["employeeId"],
        employeeName=assignment["employeeName"],
        templateId=assignment["templateId"],
        templateNombre=assignment["templateNombre"],
        periodo=assignment["periodo"],
        metricas=eval_data.metricas,
        scoreTotal=int(total_score),
        evaluatedBy=eval_data.evaluatedBy,
        evaluatedDate=datetime.now().strftime("%Y-%m-%d"),
        created_at=datetime.now()
    )
    
    await db.kpi_evaluations.insert_one(new_evaluation.dict())
    return new_evaluation
