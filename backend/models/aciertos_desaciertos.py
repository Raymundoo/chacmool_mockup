from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime

class Compromiso(BaseModel):
    tipo: Literal["colaborador", "empresa"]
    compromiso: str
    fecha: str

class AciertosDesaciertos(BaseModel):
    id: str
    evaluatorId: str
    evaluatorName: str
    evaluatedId: str
    evaluatedName: str
    department: str
    date: str
    month: int
    year: int
    quarter: str
    resultadoVsObjetivo: str
    aciertosColaborador: List[str]
    desaciertosColaborador: List[str]
    aciertosEmpresa: List[str]
    desaciertosEmpresa: List[str]
    compromisos: List[Compromiso]
    created_at: datetime = datetime.now()

class AciertosDesaciertosCreate(BaseModel):
    evaluatorId: str
    evaluatedId: str
    date: str
    resultadoVsObjetivo: str
    aciertosColaborador: List[str]
    desaciertosColaborador: List[str]
    aciertosEmpresa: List[str]
    desaciertosEmpresa: List[str]
    compromisos: List[Compromiso]

class AciertosDesaciertosUpdate(BaseModel):
    date: Optional[str] = None
    resultadoVsObjetivo: Optional[str] = None
    aciertosColaborador: Optional[List[str]] = None
    desaciertosColaborador: Optional[List[str]] = None
    aciertosEmpresa: Optional[List[str]] = None
    desaciertosEmpresa: Optional[List[str]] = None
    compromisos: Optional[List[Compromiso]] = None
