from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from models.empleado_a_evaluation import (
    EmpleadoAEvaluationPlan,
    EmpleadoAEvaluationPlanCreate,
    EmpleadoAVoteCreate,
    EmpleadoAVote,
    EmpleadoAResult,
    EmpleadoAAutoevaluacion,
    EmpleadoAAutoevaluacionCreate
)
from middlewares.auth import get_current_user, db
from datetime import datetime
from uuid import uuid4

router = APIRouter(prefix="/api/empleado-a", tags=["Empleado A Evaluations"])

# ============== EVALUATION PLANS ==============

@router.get("/plans", response_model=List[EmpleadoAEvaluationPlan])
async def get_evaluation_plans(current_user: dict = Depends(get_current_user)):
    """Obtener planes de evaluación"""
    # Si es empleado, solo ve planes donde él es el evaluado o evaluador
    if current_user["role"] == "empleado":
        employee_id = current_user.get("employee_id", "")
        plans = await db.empleado_a_plans.find({
            "$or": [
                {"employee_id": employee_id},
                {"evaluators.id": current_user["id"]}
            ]
        }, {"_id": 0}).to_list(1000)
    else:
        plans = await db.empleado_a_plans.find({}, {"_id": 0}).to_list(1000)
    
    return plans

@router.get("/plans/{plan_id}", response_model=EmpleadoAEvaluationPlan)
async def get_evaluation_plan(plan_id: str, current_user: dict = Depends(get_current_user)):
    """Obtener plan específico"""
    plan = await db.empleado_a_plans.find_one({"id": plan_id}, {"_id": 0})
    if not plan:
        raise HTTPException(status_code=404, detail="Plan no encontrado")
    
    # Verificar permisos
    if current_user["role"] == "empleado":
        employee_id = current_user.get("employee_id", "")
        is_evaluator = any(e["id"] == current_user["id"] for e in plan["evaluators"])
        if plan["employee_id"] != employee_id and not is_evaluator:
            raise HTTPException(status_code=403, detail="No autorizado")
    
    return plan

@router.post("/plans", response_model=EmpleadoAEvaluationPlan)
async def create_evaluation_plan(
    plan_data: EmpleadoAEvaluationPlanCreate,
    current_user: dict = Depends(get_current_user)
):
    """Crear plan de evaluación (solo admin/manager)"""
    if current_user["role"] not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    # Obtener empleado
    employee = await db.employees.find_one({"id": plan_data.employee_id}, {"_id": 0})
    if not employee:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    
    # Obtener evaluadores
    evaluators = []
    for evaluator_id in plan_data.evaluator_ids:
        user = await db.users.find_one({"id": evaluator_id}, {"_id": 0})
        if user:
            evaluators.append({
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "status": "pendiente"
            })
    
    new_plan = EmpleadoAEvaluationPlan(
        id=str(uuid4()),
        employee_id=plan_data.employee_id,
        employee_name=employee["name"],
        employee_email=employee.get("email", ""),
        employee_avatar=employee.get("avatar", ""),
        period=plan_data.period,
        evaluators=evaluators,
        votes=[],
        total_evaluadores=len(evaluators),
        evaluaciones_completadas=0,
        evaluaciones_pendientes=len(evaluators),
        fecha_creacion=datetime.now().strftime("%Y-%m-%d"),
        fecha_limite=plan_data.fecha_limite,
        created_at=datetime.now()
    )
    
    await db.empleado_a_plans.insert_one(new_plan.dict())
    return new_plan

@router.delete("/plans/{plan_id}")
async def delete_evaluation_plan(
    plan_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Eliminar plan de evaluación"""
    if current_user["role"] not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    result = await db.empleado_a_plans.delete_one({"id": plan_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Plan no encontrado")
    return {"message": "Plan eliminado"}

# ============== VOTES / EVALUATIONS ==============

@router.post("/plans/{plan_id}/vote", response_model=EmpleadoAVote)
async def submit_vote(
    plan_id: str,
    vote_data: EmpleadoAVoteCreate,
    current_user: dict = Depends(get_current_user)
):
    """Enviar voto/evaluación"""
    # Obtener plan
    plan = await db.empleado_a_plans.find_one({"id": plan_id}, {"_id": 0})
    if not plan:
        raise HTTPException(status_code=404, detail="Plan no encontrado")
    
    # Verificar que el usuario es un evaluador asignado
    is_evaluator = any(e["id"] == current_user["id"] for e in plan["evaluators"])
    if not is_evaluator:
        raise HTTPException(status_code=403, detail="No estás asignado como evaluador")
    
    # Verificar si ya votó
    already_voted = any(v["evaluator_id"] == current_user["id"] for v in plan.get("votes", []))
    if already_voted:
        raise HTTPException(status_code=400, detail="Ya has enviado tu evaluación")
    
    # Crear voto
    new_vote = EmpleadoAVote(
        id=str(uuid4()),
        evaluator_id=current_user["id"],
        evaluator_name=current_user["name"],
        evaluator_email=current_user["email"],
        evaluator_avatar=current_user.get("avatar", ""),
        cuadrante=vote_data.cuadrante,
        valores_score=vote_data.valores_score,
        resultados_score=vote_data.resultados_score,
        comentarios=vote_data.comentarios,
        fecha_evaluacion=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        created_at=datetime.now()
    )
    
    # Actualizar plan
    await db.empleado_a_plans.update_one(
        {"id": plan_id},
        {
            "$push": {"votes": new_vote.dict()},
            "$inc": {"evaluaciones_completadas": 1, "evaluaciones_pendientes": -1},
            "$set": {
                "evaluators": [
                    {**e, "status": "completado"} if e["id"] == current_user["id"] else e
                    for e in plan["evaluators"]
                ]
            }
        }
    )
    
    return new_vote

@router.get("/my-pending-evaluations", response_model=List[EmpleadoAEvaluationPlan])
async def get_my_pending_evaluations(current_user: dict = Depends(get_current_user)):
    """Obtener evaluaciones pendientes del usuario actual"""
    plans = await db.empleado_a_plans.find({
        "evaluators": {
            "$elemMatch": {
                "id": current_user["id"],
                "status": "pendiente"
            }
        }
    }, {"_id": 0}).to_list(1000)
    
    return plans

# ============== RESULTS ==============

@router.get("/results/{employee_id}", response_model=EmpleadoAResult)
async def get_employee_results(
    employee_id: str,
    period: str = None,
    current_user: dict = Depends(get_current_user)
):
    """Obtener resultados agregados de un empleado"""
    # Buscar plan del empleado
    query = {"employee_id": employee_id}
    if period:
        query["period"] = period
    
    plan = await db.empleado_a_plans.find_one(query, {"_id": 0})
    if not plan:
        raise HTTPException(status_code=404, detail="No se encontraron evaluaciones")
    
    # Verificar permisos (empleados solo ven sus propios resultados)
    if current_user["role"] == "empleado":
        user_employee_id = current_user.get("employee_id", "")
        if employee_id != user_employee_id:
            raise HTTPException(status_code=403, detail="No autorizado")
    
    votes = plan.get("votes", [])
    
    # Calcular estadísticas
    votos_por_cuadrante = {}
    for vote in votes:
        cuad = vote["cuadrante"]
        votos_por_cuadrante[cuad] = votos_por_cuadrante.get(cuad, 0) + 1
    
    # Cuadrante con más votos
    cuadrante_mayoria = max(votos_por_cuadrante, key=votos_por_cuadrante.get) if votos_por_cuadrante else "N/A"
    
    # Promedios
    promedio_valores = int(sum(v["valores_score"] for v in votes) / len(votes)) if votes else 0
    promedio_resultados = int(sum(v["resultados_score"] for v in votes) / len(votes)) if votes else 0
    
    result = EmpleadoAResult(
        employee_id=plan["employee_id"],
        employee_name=plan["employee_name"],
        employee_email=plan["employee_email"],
        employee_avatar=plan.get("employee_avatar", ""),
        period=plan["period"],
        total_votos=len(votes),
        votos_por_cuadrante=votos_por_cuadrante,
        cuadrante_mayoria=cuadrante_mayoria,
        promedio_valores=promedio_valores,
        promedio_resultados=promedio_resultados,
        all_votes=votes
    )
    
    return result

@router.get("/results", response_model=List[EmpleadoAResult])
async def get_all_results(
    period: str = None,
    current_user: dict = Depends(get_current_user)
):
    """Obtener todos los resultados (solo admin/manager)"""
    if current_user["role"] not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    query = {}
    if period:
        query["period"] = period
    
    plans = await db.empleado_a_plans.find(query, {"_id": 0}).to_list(1000)
    
    results = []
    for plan in plans:
        votes = plan.get("votes", [])
        if not votes:
            continue
        
        votos_por_cuadrante = {}
        for vote in votes:
            cuad = vote["cuadrante"]
            votos_por_cuadrante[cuad] = votos_por_cuadrante.get(cuad, 0) + 1
        
        cuadrante_mayoria = max(votos_por_cuadrante, key=votos_por_cuadrante.get) if votos_por_cuadrante else "N/A"
        promedio_valores = int(sum(v["valores_score"] for v in votes) / len(votes)) if votes else 0
        promedio_resultados = int(sum(v["resultados_score"] for v in votes) / len(votes)) if votes else 0
        
        result = EmpleadoAResult(
            employee_id=plan["employee_id"],
            employee_name=plan["employee_name"],
            employee_email=plan["employee_email"],
            employee_avatar=plan.get("employee_avatar", ""),
            period=plan["period"],
            total_votos=len(votes),
            votos_por_cuadrante=votos_por_cuadrante,
            cuadrante_mayoria=cuadrante_mayoria,
            promedio_valores=promedio_valores,
            promedio_resultados=promedio_resultados,
            all_votes=votes
        )
        results.append(result)
    
    return results


# ============== AUTOEVALUACIÓN ==============

@router.post("/autoevaluacion", response_model=EmpleadoAAutoevaluacion)
async def create_autoevaluacion(
    data: EmpleadoAAutoevaluacionCreate,
    current_user: dict = Depends(get_current_user)
):
    """Crear o actualizar autoevaluación del usuario actual"""
    employee_id = current_user.get("employee_id")
    if not employee_id:
        raise HTTPException(status_code=400, detail="Usuario no tiene employee_id asociado")
    
    # Verificar si ya existe una autoevaluación para este periodo
    existing = await db.empleado_a_autoevaluaciones.find_one({
        "employee_id": employee_id,
        "period": data.period
    }, {"_id": 0})
    
    if existing:
        # Actualizar existente
        await db.empleado_a_autoevaluaciones.update_one(
            {"employee_id": employee_id, "period": data.period},
            {"$set": {
                "cuadrante": data.cuadrante,
                "valores_score": data.valores_score,
                "resultados_score": data.resultados_score,
                "comentarios": data.comentarios,
                "fecha_evaluacion": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }}
        )
        updated = await db.empleado_a_autoevaluaciones.find_one({
            "employee_id": employee_id,
            "period": data.period
        }, {"_id": 0})
        return updated
    
    # Crear nueva
    autoevaluacion = EmpleadoAAutoevaluacion(
        id=str(uuid4()),
        employee_id=employee_id,
        employee_name=current_user["name"],
        period=data.period,
        cuadrante=data.cuadrante,
        valores_score=data.valores_score,
        resultados_score=data.resultados_score,
        comentarios=data.comentarios,
        fecha_evaluacion=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        created_at=datetime.now()
    )
    
    await db.empleado_a_autoevaluaciones.insert_one(autoevaluacion.dict())
    return autoevaluacion

@router.get("/autoevaluacion/{employee_id}", response_model=Optional[EmpleadoAAutoevaluacion])
async def get_autoevaluacion(
    employee_id: str,
    period: str = None,
    current_user: dict = Depends(get_current_user)
):
    """Obtener autoevaluación de un empleado"""
    # Verificar permisos
    if current_user["role"] not in ["admin"] and current_user.get("employee_id") != employee_id:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    query = {"employee_id": employee_id}
    if period:
        query["period"] = period
    
    autoevaluacion = await db.empleado_a_autoevaluaciones.find_one(query, {"_id": 0})
    return autoevaluacion

    return results
