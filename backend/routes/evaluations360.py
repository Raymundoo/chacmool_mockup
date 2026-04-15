from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models.evaluation360 import (
    Eval360Template, Eval360TemplateCreate,
    EvaluationPlan, EvaluationPlanCreate,
    EvaluationResult,
    PDI, PDICreate
)
from middlewares.auth import get_current_user, db
from datetime import datetime
from uuid import uuid4

router = APIRouter(prefix="/api/evaluations360", tags=["Evaluations 360"])

# ============== TEMPLATES ==============

@router.get("/templates", response_model=List[Eval360Template])
async def get_eval360_templates(current_user: dict = Depends(get_current_user)):
    """Obtener todas las plantillas de evaluación 360"""
    templates = await db.eval360_templates.find({}, {"_id": 0}).to_list(1000)
    return templates

@router.get("/templates/{template_id}", response_model=Eval360Template)
async def get_eval360_template(template_id: str, current_user: dict = Depends(get_current_user)):
    """Obtener plantilla específica"""
    template = await db.eval360_templates.find_one({"id": template_id}, {"_id": 0})
    if not template:
        raise HTTPException(status_code=404, detail="Plantilla no encontrada")
    return template

@router.post("/templates", response_model=Eval360Template)
async def create_eval360_template(
    template_data: Eval360TemplateCreate,
    current_user: dict = Depends(get_current_user)
):
    """Crear nueva plantilla 360"""
    if current_user["role"] not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    new_template = Eval360Template(
        id=str(uuid4()),
        **template_data.dict(),
        created_at=datetime.now()
    )
    await db.eval360_templates.insert_one(new_template.dict())
    return new_template

@router.put("/templates/{template_id}", response_model=Eval360Template)
async def update_eval360_template(
    template_id: str,
    template_data: Eval360TemplateCreate,
    current_user: dict = Depends(get_current_user)
):
    """Actualizar plantilla 360"""
    if current_user["role"] not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    updated = await db.eval360_templates.update_one(
        {"id": template_id},
        {"$set": template_data.dict()}
    )
    if updated.matched_count == 0:
        raise HTTPException(status_code=404, detail="Plantilla no encontrada")
    
    template = await db.eval360_templates.find_one({"id": template_id}, {"_id": 0})
    return template

@router.delete("/templates/{template_id}")
async def delete_eval360_template(
    template_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Eliminar plantilla 360"""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores")
    
    result = await db.eval360_templates.delete_one({"id": template_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Plantilla no encontrada")
    return {"message": "Plantilla eliminada"}

# ============== EVALUATION PLANS ==============

@router.get("/plans", response_model=List[EvaluationPlan])
async def get_evaluation_plans(current_user: dict = Depends(get_current_user)):
    """Obtener planes de evaluación"""
    
    if current_user["role"] == "empleado":
        plans = await db.evaluation_plans.find(
            {"employeeId": current_user.get("employeeId", "")},
            {"_id": 0}
        ).to_list(1000)
    else:
        plans = await db.evaluation_plans.find({}, {"_id": 0}).to_list(1000)
    
    return plans

@router.post("/plans", response_model=EvaluationPlan)
async def create_evaluation_plan(
    plan_data: EvaluationPlanCreate,
    current_user: dict = Depends(get_current_user)
):
    """Crear plan de evaluación 360"""
    if current_user["role"] not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    
    # Obtener employee y template
    employee = await db.employees.find_one({"id": plan_data.employeeId}, {"_id": 0})
    template = await db.eval360_templates.find_one({"id": plan_data.templateId}, {"_id": 0})
    
    if not employee:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    if not template:
        raise HTTPException(status_code=404, detail="Plantilla no encontrada")
    
    new_plan = EvaluationPlan(
        id=str(uuid4()),
        employeeId=plan_data.employeeId,
        employeeName=employee["name"],
        templateId=plan_data.templateId,
        templateName=template["name"],
        period=plan_data.period,
        createdDate=datetime.now().strftime("%Y-%m-%d"),
        dueDate=plan_data.dueDate,
        evaluators=plan_data.evaluators
    )
    
    await db.evaluation_plans.insert_one(new_plan.dict())
    return new_plan

@router.get("/plans/{plan_id}", response_model=EvaluationPlan)
async def get_evaluation_plan(plan_id: str, current_user: dict = Depends(get_current_user)):
    """Obtener plan específico"""
    plan = await db.evaluation_plans.find_one({"id": plan_id}, {"_id": 0})
    if not plan:
        raise HTTPException(status_code=404, detail="Plan no encontrado")
    return plan

@router.delete("/plans/{plan_id}")
async def delete_evaluation_plan(
    plan_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Eliminar plan de evaluación"""
    if current_user["role"] not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    result = await db.evaluation_plans.delete_one({"id": plan_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Plan no encontrado")
    return {"message": "Plan eliminado"}

# ============== RESULTS ==============

@router.get("/results", response_model=List[EvaluationResult])
async def get_evaluation_results(current_user: dict = Depends(get_current_user)):
    """Obtener resultados de evaluaciones 360"""
    
    if current_user["role"] == "empleado":
        results = await db.evaluation_results.find(
            {"employeeId": current_user.get("employeeId", "")},
            {"_id": 0}
        ).to_list(1000)
    else:
        results = await db.evaluation_results.find({}, {"_id": 0}).to_list(1000)
    
    return results

# ============== PDIs ==============

@router.get("/pdis", response_model=List[PDI])
async def get_pdis(current_user: dict = Depends(get_current_user)):
    """Obtener PDIs (Planes de Desarrollo Individual)"""
    
    if current_user["role"] == "empleado":
        pdis = await db.pdis.find(
            {"employeeId": current_user.get("employeeId", "")},
            {"_id": 0}
        ).to_list(1000)
    else:
        pdis = await db.pdis.find({}, {"_id": 0}).to_list(1000)
    
    return pdis

@router.post("/pdis", response_model=PDI)
async def create_pdi(
    pdi_data: PDICreate,
    current_user: dict = Depends(get_current_user)
):
    """Crear PDI"""
    if current_user["role"] not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    
    # Obtener employee
    employee = await db.employees.find_one({"id": pdi_data.employeeId}, {"_id": 0})
    if not employee:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    
    new_pdi = PDI(
        id=str(uuid4()),
        employeeId=pdi_data.employeeId,
        employeeName=employee["name"],
        department=employee["area"],
        leader=employee.get("superior", ""),
        reviewer="",
        period=pdi_data.period,
        quarters=pdi_data.quarters,
        created_at=datetime.now()
    )
    
    await db.pdis.insert_one(new_pdi.dict())
    return new_pdi

@router.put("/pdis/{pdi_id}", response_model=PDI)
async def update_pdi(
    pdi_id: str,
    pdi_data: PDICreate,
    current_user: dict = Depends(get_current_user)
):
    """Actualizar PDI"""
    if current_user["role"] not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    updated = await db.pdis.update_one(
        {"id": pdi_id},
        {"$set": {"quarters": [q.dict() for q in pdi_data.quarters]}}
    )
    if updated.matched_count == 0:
        raise HTTPException(status_code=404, detail="PDI no encontrado")
    
    pdi = await db.pdis.find_one({"id": pdi_id}, {"_id": 0})
    return pdi
