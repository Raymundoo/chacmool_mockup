from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class KPIMetric(BaseModel):
    id: str
    nombre: str
    descripcion: str
    peso: int  # Peso del KPI en %
    umbralRojo: int  # 0-60
    umbralAmarillo: int  # 61-80
    umbralVerde: int  # 81-100

class KPITemplate(BaseModel):
    id: str
    nombre: str
    descripcion: str
    area: str  # ventas, soporte, tecnologia, etc
    metricas: List[KPIMetric]
    created_at: datetime = datetime.now()

class KPITemplateCreate(BaseModel):
    nombre: str
    descripcion: str
    area: str
    metricas: List[KPIMetric]

class KPIAssignment(BaseModel):
    id: str
    templateId: str
    templateNombre: str
    employeeId: str
    employeeName: str
    area: str
    periodo: str  # "Q1 2024", "Enero 2024", etc
    assignedDate: str
    created_at: datetime = datetime.now()

class KPIAssignmentCreate(BaseModel):
    templateId: str
    employeeId: str
    periodo: str

class KPIEvaluationMetric(BaseModel):
    metricaId: str
    nombre: str
    valorObtenido: int  # 0-100
    peso: int

class KPIEvaluation(BaseModel):
    id: str
    assignmentId: str
    employeeId: str
    employeeName: str
    templateId: str
    templateNombre: str
    periodo: str
    metricas: List[KPIEvaluationMetric]
    scoreTotal: int  # Ponderado 0-100
    evaluatedBy: str  # userId del evaluador
    evaluatedDate: str
    created_at: datetime = datetime.now()

class KPIEvaluationCreate(BaseModel):
    assignmentId: str
    metricas: List[KPIEvaluationMetric]
    evaluatedBy: str
