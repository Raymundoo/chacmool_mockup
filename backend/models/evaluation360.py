from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime

class CompetencyResponse(BaseModel):
    value: int
    label: str
    description: str

class Competency(BaseModel):
    id: str
    title: str
    behavior: str
    description: Optional[str] = ""
    responses: List[CompetencyResponse]

class Eval360Template(BaseModel):
    id: str
    name: str
    description: str
    generalDescription: Optional[str] = ""
    isActive: bool = True
    assignedPositions: List[str]
    competencies: List[Competency]
    created_at: datetime = datetime.now()

class Eval360TemplateCreate(BaseModel):
    name: str
    description: str
    generalDescription: Optional[str] = ""
    assignedPositions: List[str]
    competencies: List[Competency]

class Evaluator(BaseModel):
    id: str
    type: Literal["lider", "igual", "subordinado", "cliente", "autoevaluacion"]
    name: str
    email: str
    status: Literal["pendiente", "enviado", "completado"]
    link: str
    completedDate: Optional[str] = None

class EvaluationPlan(BaseModel):
    id: str
    employeeId: str
    employeeName: str
    templateId: str
    templateName: str
    period: str
    createdDate: str
    dueDate: str
    evaluators: List[Evaluator]

class EvaluationPlanCreate(BaseModel):
    employeeId: str
    templateId: str
    period: str
    dueDate: str
    evaluators: List[Evaluator]

class EvaluationResponse(BaseModel):
    evaluatorId: str
    type: str
    score: int

class CompetencyResult(BaseModel):
    responses: List[EvaluationResponse]
    average: float
    mostCommon: int

class EvaluationResult(BaseModel):
    planId: str
    employeeId: str
    employeeName: str
    results: dict  # {competencyId: CompetencyResult}

class PDIQuarter(BaseModel):
    quarter: str
    meta: str
    realidad: str
    aprendizajeFormal: str
    aprendizajeSocial: str
    aprendizajeAplicado: str
    voluntad: str
    evaluaciones: str

class PDI(BaseModel):
    id: str
    employeeId: str
    employeeName: str
    department: str
    leader: str
    reviewer: str
    period: str
    quarters: List[PDIQuarter]
    created_at: datetime = datetime.now()

class PDICreate(BaseModel):
    employeeId: str
    period: str
    quarters: List[PDIQuarter]
