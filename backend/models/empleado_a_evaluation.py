from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime

class EmpleadoAVote(BaseModel):
    """Voto individual en la evaluación de Empleado A"""
    id: str
    evaluator_id: str  # ID del usuario que evalúa
    evaluator_name: str
    evaluator_email: str
    evaluator_avatar: Optional[str] = ""
    cuadrante: Literal["A", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"]
    valores_score: int  # 0-100
    resultados_score: int  # 0-100
    comentarios: Optional[str] = ""
    fecha_evaluacion: str
    created_at: datetime = datetime.now()

class EmpleadoAEvaluationPlan(BaseModel):
    """Plan de evaluación para un empleado en matriz 9-box"""
    id: str
    employee_id: str
    employee_name: str
    employee_email: str
    employee_avatar: Optional[str] = ""
    period: str  # "Q1 2024", "2024", etc
    status: Literal["activo", "completado", "cancelado"] = "activo"
    evaluators: List[dict]  # Lista de {id, name, email, status: "pendiente"|"completado"}
    votes: List[EmpleadoAVote] = []
    total_evaluadores: int
    evaluaciones_completadas: int
    evaluaciones_pendientes: int
    fecha_creacion: str
    fecha_limite: str
    created_at: datetime = datetime.now()

class EmpleadoAEvaluationPlanCreate(BaseModel):
    """Crear plan de evaluación"""
    employee_id: str
    period: str
    fecha_limite: str
    evaluator_ids: List[str]  # IDs de usuarios que evaluarán

class EmpleadoAVoteCreate(BaseModel):
    """Crear voto/evaluación"""
    # plan_id is passed as path parameter, not in body
    cuadrante: Literal["A", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"]
    valores_score: int
    resultados_score: int
    comentarios: Optional[str] = ""

class EmpleadoAAutoevaluacion(BaseModel):
    """Autoevaluación del empleado"""
    id: str
    employee_id: str
    employee_name: str
    period: str
    cuadrante: Literal["A", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"]
    valores_score: int
    resultados_score: int
    comentarios: Optional[str] = ""
    fecha_evaluacion: str
    created_at: datetime = datetime.now()

class EmpleadoAAutoevaluacionCreate(BaseModel):
    """Crear autoevaluación"""
    period: str
    cuadrante: Literal["A", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"]
    valores_score: int
    resultados_score: int
    comentarios: Optional[str] = ""

class EmpleadoAResult(BaseModel):
    """Resultado agregado de evaluaciones de un empleado"""
    employee_id: str
    employee_name: str
    employee_email: str
    employee_avatar: Optional[str] = ""
    period: str
    total_votos: int
    votos_por_cuadrante: dict  # {"A": 5, "B1": 2, ...}
    cuadrante_mayoria: str
    promedio_valores: int
    promedio_resultados: int
    all_votes: List[EmpleadoAVote]
