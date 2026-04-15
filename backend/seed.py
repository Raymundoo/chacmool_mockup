import asyncio
import os
import sys
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime

# Add parent directory to path to import utils
sys.path.append(str(Path(__file__).parent))

from utils.auth import get_password_hash

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "evalpro_db")

async def seed_database():
    """Seed database with initial data"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("🌱 Seeding database...")
    
    # Clear existing data
    print("Clearing existing data...")
    await db.users.delete_many({})
    await db.employees.delete_many({})
    await db.aciertos_desaciertos.delete_many({})
    await db.kpi_templates.delete_many({})
    await db.kpi_assignments.delete_many({})
    await db.kpi_evaluations.delete_many({})
    await db.eval360_templates.delete_many({})
    await db.evaluation_plans.delete_many({})
    await db.evaluation_results.delete_many({})
    await db.pdis.delete_many({})
    
    # Seed Users
    print("Creating users...")
    users = [
        {
            "id": "admin-1",
            "email": "admin@empresa.com",
            "name": "Admin Usuario",
            "hashed_password": get_password_hash("admin123"),
            "role": "admin",
            "department": "Administración",
            "position": "Administrador",
            "is_active": True,
            "created_at": datetime.now()
        },
        {
            "id": "manager-1",
            "email": "manager@empresa.com",
            "name": "Manager Usuario",
            "hashed_password": get_password_hash("manager123"),
            "role": "manager",
            "department": "Tecnología",
            "position": "Director de Tecnología",
            "is_active": True,
            "created_at": datetime.now()
        },
        {
            "id": "emp-1",
            "email": "empleado@empresa.com",
            "name": "Empleado Usuario",
            "hashed_password": get_password_hash("empleado123"),
            "role": "empleado",
            "department": "Desarrollo",
            "position": "Desarrollador",
            "is_active": True,
            "created_at": datetime.now()
        }
    ]
    await db.users.insert_many(users)
    print(f"✅ Created {len(users)} users")
    
    # Seed Employees
    print("Creating employees...")
    employees = [
        {"id": "1", "name": "María García López", "position": "Tech Lead", "department": "Tecnología", "email": "maria@empresa.com", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", "evaluations": {"superior": 90, "subordinados": 88, "companeros": 85, "cliente": 92}, "kpis_score": 88, "eval_360_score": 89, "category": "A", "created_at": datetime.now()},
        {"id": "2", "name": "Juan Rodríguez", "position": "Senior Developer", "department": "Desarrollo", "email": "juan@empresa.com", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan", "evaluations": {"superior": 82, "subordinados": 80, "companeros": 78}, "kpis_score": 82, "eval_360_score": 80, "category": "B1", "created_at": datetime.now()},
        {"id": "3", "name": "Laura Sánchez", "position": "Sales Manager", "department": "Ventas", "email": "laura@empresa.com", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura", "evaluations": {"superior": 75, "companeros": 80}, "kpis_score": 72, "eval_360_score": 77, "category": "B2", "created_at": datetime.now()},
        {"id": "4", "name": "Carlos Mendoza", "position": "Developer", "department": "Tecnología", "email": "carlos@empresa.com", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos", "evaluations": {"superior": 88, "companeros": 85}, "kpis_score": 85, "eval_360_score": 87, "category": "A", "created_at": datetime.now()},
        {"id": "5", "name": "Ana Martínez", "position": "Junior Developer", "department": "Tecnología", "email": "ana@empresa.com", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana", "evaluations": {"superior": 70, "companeros": 75}, "kpis_score": 68, "eval_360_score": 72, "category": "B2", "created_at": datetime.now()},
        {"id": "6", "name": "Roberto Fernández", "position": "Operations Manager", "department": "Operaciones", "email": "roberto@empresa.com", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto", "evaluations": {"superior": 78, "subordinados": 76}, "kpis_score": 80, "eval_360_score": 77, "category": "B1", "created_at": datetime.now()},
        {"id": "7", "name": "Patricia Ruiz", "position": "Sales Representative", "department": "Ventas", "email": "patricia@empresa.com", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia", "evaluations": {"superior": 65}, "kpis_score": 60, "eval_360_score": 65, "category": "C1", "created_at": datetime.now()},
        {"id": "8", "name": "Diego Morales", "position": "Product Manager", "department": "Producto", "email": "diego@empresa.com", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Diego", "evaluations": {"superior": 85, "companeros": 82}, "kpis_score": 84, "eval_360_score": 83, "category": "B1", "created_at": datetime.now()}
    ]
    await db.employees.insert_many(employees)
    print(f"✅ Created {len(employees)} employees")
    
    # Seed Aciertos y Desaciertos
    print("Creating Aciertos y Desaciertos evaluations...")
    aciertos_data = [
        {"id": "ad-1", "evaluatorId": "1", "evaluatorName": "María García López", "evaluatedId": "4", "evaluatedName": "Carlos Mendoza", "department": "Tecnología", "date": "2024-03-15", "month": 3, "year": 2024, "quarter": "Q1 2024", "resultadoVsObjetivo": "Carlos ha mostrado un desempeño superior al esperado este trimestre. Logró completar el proyecto de migración de base de datos 2 semanas antes de lo planeado.", "aciertosColaborador": ["Excelente capacidad técnica", "Proactividad en identificación de bugs", "Mentoría efectiva", "Cumplimiento anticipado"], "desaciertosColaborador": ["Falta de comunicación sobre bloqueos", "Documentación incompleta", "Poca participación en reuniones"], "aciertosEmpresa": ["Provisión de herramientas adecuadas", "Flexibilidad en horarios", "Capacitación continua"], "desaciertosEmpresa": ["Falta de claridad en requisitos", "Cambios frecuentes de prioridades", "Proceso de aprobación lento"], "compromisos": [{"tipo": "colaborador", "compromiso": "Enviar reportes semanales", "fecha": "2024-04-01"}, {"tipo": "empresa", "compromiso": "Definir requisitos completos", "fecha": "2024-04-01"}], "created_at": datetime.now()},
        {"id": "ad-2", "evaluatorId": "director", "evaluatorName": "Director Comercial", "evaluatedId": "3", "evaluatedName": "Laura Sánchez", "department": "Ventas", "date": "2024-03-20", "month": 3, "year": 2024, "quarter": "Q1 2024", "resultadoVsObjetivo": "Laura alcanzó el 85% de su objetivo de ventas del trimestre.", "aciertosColaborador": ["Excelente relación con clientes", "Mejora progresiva", "Actitud positiva"], "desaciertosColaborador": ["Dificultad para cerrar ventas grandes", "Falta de seguimiento sistemático"], "aciertosEmpresa": ["Material de ventas de calidad", "Capacitación en producto"], "desaciertosEmpresa": ["Falta de CRM actualizado", "Proceso de descuentos lento"], "compromisos": [{"tipo": "colaborador", "compromiso": "Completar curso de negociación", "fecha": "2024-05-01"}, {"tipo": "empresa", "compromiso": "Implementar CRM Salesforce", "fecha": "2024-05-15"}], "created_at": datetime.now()},
        {"id": "ad-3", "evaluatorId": "techlead", "evaluatorName": "Tech Lead Senior", "evaluatedId": "2", "evaluatedName": "Juan Rodríguez", "department": "Desarrollo", "date": "2024-02-28", "month": 2, "year": 2024, "quarter": "Q1 2024", "resultadoVsObjetivo": "Juan cumplió con todos los objetivos técnicos del mes.", "aciertosColaborador": ["Código limpio", "Resolución rápida de bugs", "Ayuda proactiva", "Ownership completo"], "desaciertosColaborador": ["Over-engineering de soluciones", "Podría comunicar mejor decisiones"], "aciertosEmpresa": ["Stack moderno", "Buen ambiente", "Code review efectivo"], "desaciertosEmpresa": ["Falta de documentación arquitectónica", "Reuniones frecuentes"], "compromisos": [{"tipo": "colaborador", "compromiso": "Aplicar principio KISS", "fecha": "2024-03-15"}, {"tipo": "empresa", "compromiso": "Crear documentación arquitectónica", "fecha": "2024-04-01"}], "created_at": datetime.now()},
        {"id": "ad-4", "evaluatorId": "1", "evaluatorName": "María García López", "evaluatedId": "5", "evaluatedName": "Ana Martínez", "department": "Tecnología", "date": "2024-01-30", "month": 1, "year": 2024, "quarter": "Q1 2024", "resultadoVsObjetivo": "Ana está en su tercer mes. Ha mostrado rápida curva de aprendizaje.", "aciertosColaborador": ["Rápida adaptación", "Hace muchas preguntas", "Puntualidad"], "desaciertosColaborador": ["Falta de confianza", "Necesita práctica en debugging", "Tarda en pedir ayuda"], "aciertosEmpresa": ["Onboarding estructurado", "Mentor asignado"], "desaciertosEmpresa": ["Documentación desactualizada", "Falta de tiempo para pair programming"], "compromisos": [{"tipo": "colaborador", "compromiso": "Regla de 30 minutos para pedir ayuda", "fecha": "2024-02-01"}, {"tipo": "empresa", "compromiso": "Actualizar documentación", "fecha": "2024-02-28"}], "created_at": datetime.now()},
        {"id": "ad-5", "evaluatorId": "director", "evaluatorName": "Director Operaciones", "evaluatedId": "1", "evaluatedName": "María García López", "department": "Tecnología", "date": "2024-03-10", "month": 3, "year": 2024, "quarter": "Q1 2024", "resultadoVsObjetivo": "María superó objetivos del trimestre. El equipo entregó 3 proyectos sin incidentes.", "aciertosColaborador": ["Liderazgo efectivo", "Excelente planificación", "Desarrollo de talento", "Comunicación clara"], "desaciertosColaborador": ["Demasiado involucrada en tareas operativas", "Podría delegar más", "Muchas horas extra"], "aciertosEmpresa": ["Autonomía en decisiones", "Budget adecuado"], "desaciertosEmpresa": ["Falta de roadmap visible", "Expectativas 24/7"], "compromisos": [{"tipo": "colaborador", "compromiso": "Delegar tareas operativas", "fecha": "2024-04-01"}, {"tipo": "empresa", "compromiso": "Compartir roadmap trimestral", "fecha": "2024-04-15"}], "created_at": datetime.now()},
        {"id": "ad-6", "evaluatorId": "gerente", "evaluatorName": "Gerente RRHH", "evaluatedId": "6", "evaluatedName": "Roberto Fernández", "department": "Operaciones", "date": "2024-02-15", "month": 2, "year": 2024, "quarter": "Q1 2024", "resultadoVsObjetivo": "Roberto alcanzó el 92% de sus KPIs operativos.", "aciertosColaborador": ["Optimización de procesos", "Datos actualizados", "Iniciativa"], "desaciertosColaborador": ["Dificultad para dar feedback", "Falta de seguimiento", "Gestión de conflictos"], "aciertosEmpresa": ["Inversión en software", "Apoyo en mejoras"], "desaciertosEmpresa": ["Falta de capacitación en liderazgo", "Poco tiempo para desarrollo"], "compromisos": [{"tipo": "colaborador", "compromiso": "Taller de liderazgo", "fecha": "2024-03-30"}, {"tipo": "empresa", "compromiso": "Programa de mentoring", "fecha": "2024-03-15"}], "created_at": datetime.now()},
        {"id": "ad-7", "evaluatorId": "director", "evaluatorName": "Director Comercial", "evaluatedId": "7", "evaluatedName": "Patricia Ruiz", "department": "Ventas", "date": "2024-01-25", "month": 1, "year": 2024, "quarter": "Q1 2024", "resultadoVsObjetivo": "Patricia está teniendo dificultades (60% de meta).", "aciertosColaborador": ["Actitud positiva", "Esfuerzo evidente", "Gestión de pipeline"], "desaciertosColaborador": ["Falta de técnicas de cierre", "Dificultad con objeciones", "Conocimiento de producto", "Falta de seguimiento"], "aciertosEmpresa": ["Soporte disponible"], "desaciertosEmpresa": ["Onboarding insuficiente", "Falta de capacitación", "No hay shadowing"], "compromisos": [{"tipo": "colaborador", "compromiso": "Certificación de producto", "fecha": "2024-02-28"}, {"tipo": "empresa", "compromiso": "Asignar mentor senior", "fecha": "2024-02-01"}], "created_at": datetime.now()}
    ]
    await db.aciertos_desaciertos.insert_many(aciertos_data)
    print(f"✅ Created {len(aciertos_data)} Aciertos y Desaciertos evaluations")
    
    # Seed KPI Templates
    print("Creating KPI templates...")
    kpi_templates = [
        {
            "id": "kpi-template-1",
            "nombre": "KPIs Comerciales",
            "descripcion": "Para el área de ventas",
            "area": "ventas",
            "metricas": [
                {"id": "m1", "nombre": "Ventas mensuales", "descripcion": "Meta: 100000 $", "peso": 40, "umbralRojo": 60, "umbralAmarillo": 80, "umbralVerde": 100},
                {"id": "m2", "nombre": "Clientes nuevos", "descripcion": "Meta: 10 clientes", "peso": 30, "umbralRojo": 60, "umbralAmarillo": 80, "umbralVerde": 95},
                {"id": "m3", "nombre": "Retención", "descripcion": "Meta: 95 %", "peso": 30, "umbralRojo": 60, "umbralAmarillo": 80, "umbralVerde": 95}
            ],
            "created_at": datetime.now()
        },
        {
            "id": "kpi-template-2",
            "nombre": "KPIs Soporte",
            "descripcion": "Para el área de soporte técnico",
            "area": "soporte",
            "metricas": [
                {"id": "m1", "nombre": "Tickets resueltos", "descripcion": "Meta: 100 tickets", "peso": 40, "umbralRojo": 60, "umbralAmarillo": 80, "umbralVerde": 100},
                {"id": "m2", "nombre": "Tiempo promedio resolución", "descripcion": "Meta: 4 hrs", "peso": 35, "umbralRojo": 60, "umbralAmarillo": 80, "umbralVerde": 100},
                {"id": "m3", "nombre": "Satisfacción cliente", "descripcion": "Meta: 90 %", "peso": 25, "umbralRojo": 60, "umbralAmarillo": 80, "umbralVerde": 90}
            ],
            "created_at": datetime.now()
        }
    ]
    await db.kpi_templates.insert_many(kpi_templates)
    print(f"✅ Created {len(kpi_templates)} KPI templates")
    
    # Seed Evaluation 360 Templates
    print("Creating Evaluation 360 templates...")
    eval360_templates = [
        {
            "id": "eval360-template-1",
            "name": "Evaluación de Liderazgo",
            "description": "Para jefes y gerentes",
            "generalDescription": "Esta evaluación mide competencias de liderazgo",
            "isActive": True,
            "assignedPositions": ["Tech Lead", "Manager", "Director"],
            "competencies": [
                {
                    "id": "comp1",
                    "title": "Comunicación efectiva",
                    "behavior": "Se comunica de forma clara y oportuna",
                    "description": "Capacidad para transmitir información",
                    "responses": [
                        {"value": 1, "label": "Nunca", "description": "No cumple"},
                        {"value": 2, "label": "A veces", "description": "Cumple parcialmente"},
                        {"value": 3, "label": "Frecuentemente", "description": "Cumple"},
                        {"value": 4, "label": "Siempre", "description": "Supera expectativas"}
                    ]
                },
                {
                    "id": "comp2",
                    "title": "Toma de decisiones",
                    "behavior": "Toma decisiones informadas y oportunas",
                    "description": "Capacidad para decidir bajo presión",
                    "responses": [
                        {"value": 1, "label": "Nunca", "description": "No cumple"},
                        {"value": 2, "label": "A veces", "description": "Cumple parcialmente"},
                        {"value": 3, "label": "Frecuentemente", "description": "Cumple"},
                        {"value": 4, "label": "Siempre", "description": "Supera expectativas"}
                    ]
                }
            ],
            "created_at": datetime.now()
        },
        {
            "id": "eval360-template-2",
            "name": "Evaluación de Desempeño General",
            "description": "Para todos los empleados",
            "generalDescription": "Evaluación general de competencias",
            "isActive": True,
            "assignedPositions": ["Developer", "Designer", "Sales"],
            "competencies": [
                {
                    "id": "comp1",
                    "title": "Trabajo en equipo",
                    "behavior": "Colabora efectivamente con otros",
                    "description": "",
                    "responses": [
                        {"value": 1, "label": "Nunca", "description": "No cumple"},
                        {"value": 2, "label": "A veces", "description": "Cumple parcialmente"},
                        {"value": 3, "label": "Frecuentemente", "description": "Cumple"},
                        {"value": 4, "label": "Siempre", "description": "Supera expectativas"}
                    ]
                },
                {
                    "id": "comp2",
                    "title": "Orientación a resultados",
                    "behavior": "Cumple con objetivos establecidos",
                    "description": "",
                    "responses": [
                        {"value": 1, "label": "Nunca", "description": "No cumple"},
                        {"value": 2, "label": "A veces", "description": "Cumple parcialmente"},
                        {"value": 3, "label": "Frecuentemente", "description": "Cumple"},
                        {"value": 4, "label": "Siempre", "description": "Supera expectativas"}
                    ]
                }
            ],
            "created_at": datetime.now()
        }
    ]
    await db.eval360_templates.insert_many(eval360_templates)
    print(f"✅ Created {len(eval360_templates)} Evaluation 360 templates")
    
    # Seed PDIs
    print("Creating PDIs...")
    pdis = [
        {
            "id": "pdi-1",
            "employeeId": "1",
            "employeeName": "María García López",
            "department": "Tecnología",
            "leader": "Director Operaciones",
            "reviewer": "RRHH",
            "period": "2024",
            "quarters": [
                {
                    "quarter": "Q1",
                    "meta": "Mejorar habilidades de delegación",
                    "realidad": "Actualmente maneja demasiadas tareas operativas",
                    "aprendizajeFormal": "Curso de liderazgo avanzado",
                    "aprendizajeSocial": "Mentoring con otros líderes",
                    "aprendizajeAplicado": "Aplicar técnicas en proyectos reales",
                    "voluntad": "Alta",
                    "evaluaciones": "En progreso"
                },
                {
                    "quarter": "Q2",
                    "meta": "Desarrollar visión estratégica",
                    "realidad": "Foco actual en tácticas",
                    "aprendizajeFormal": "MBA módulo estrategia",
                    "aprendizajeSocial": "Sesiones con C-level",
                    "aprendizajeAplicado": "Crear roadmap anual",
                    "voluntad": "Alta",
                    "evaluaciones": "Pendiente"
                }
            ],
            "created_at": datetime.now()
        }
    ]
    await db.pdis.insert_many(pdis)
    print(f"✅ Created {len(pdis)} PDIs")
    
    print("\n🎉 Database seeded successfully!")
    print("\n📝 Test Credentials:")
    print("   Admin: admin@empresa.com / admin123")
    print("   Manager: manager@empresa.com / manager123")
    print("   Empleado: empleado@empresa.com / empleado123")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
