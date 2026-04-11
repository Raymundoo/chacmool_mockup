# EvalPro - Sistema de Evaluación de Empleados v3

## Problem Statement
Sistema web completo de evaluación de empleados que combina:
- KPIs (resultados cuantitativos, 0-100)
- Evaluación 360 (valores/habilidades blandas, 0-100)
- Matriz 9-box personalizada (A, B1-B4, C1-C4)

## Estado Actual
**MOCKUPS VISUALES v3 COMPLETOS** - Pendiente aprobación

## Vistas Implementadas (7 principales + 1 pública)

### 1. Dashboard General (/)
- Estadísticas: Empleados, Promedio KPI, Top Performers, Requieren Atención, Pendientes
- Mini matriz 9-box con conteo y avatares
- Filtro por departamento
- Acciones rápidas

### 2. Matriz 9-Box Mejorada (/9box)
- **Nombres de empleados visibles en cada celda**
- Filtros por departamento y tipo de evaluación (Automático, Autoevaluación, Líder, Pares)
- Panel de detalle al seleccionar empleado
- Barras de progreso de scores

### 3. Evaluaciones 360 (/evaluations)
- Lista de plantillas (360 y KPI)
- Detalle con categorías y preguntas
- **Pesos auto-ajustables** (al modificar uno, los demás se ajustan para mantener 100%)
- Indicador visual de peso total
- **Generar enlaces públicos** con tipos de evaluador:
  - Líder
  - Par/Colega
  - Cliente
  - Proveedor
  - Autoevaluación

### 4. Gestión de KPIs (/kpis)
**4 pestañas:**
- **Crear KPIs**: Nombre, tipo, unidad, umbrales de color (rojo/amarillo/verde)
- **Mis KPIs**: Indicadores con progreso, metas SMART, estados (Aprobado/Pendiente/En Revisión)
- **Revisión**: KPIs pendientes de aprobación con botones aprobar/rechazar
- **Comparativa**: Gráficas de rendimiento por equipo y evolución temporal

### 5. Evaluación Manual (/manual-eval)
- Lista de empleados con clasificación actual
- **Grid 3x3 para seleccionar cuadrante directamente**
- Campo de justificación
- Override de clasificación

### 6. Resultados (/results)
- Selector de empleado
- **Gráfica de Araña** (Spider/Radar) por competencias
- **Gráfica de Pie** - Desglose por tipo de evaluador
- Puntuaciones detalladas

### 7. Empleados (/employees)
- Tabla con búsqueda y filtros
- KPI, 360 y clasificación por empleado

### 8. Formulario Público (/evaluate/:token)
- Sin autenticación (acceso por link)
- Multi-step con progress bar
- Preguntas con escala 1-5
- Pantalla de agradecimiento al finalizar

## Datos Mock
- 8 empleados en 6 departamentos
- 2 plantillas de evaluación (360 y KPI)
- 5 tipos de evaluadores
- KPIs con estados y feedback

## Funcionalidades Clave Implementadas ✅
- [x] Pesos auto-ajustables (suma siempre 100%)
- [x] Nombres visibles en matriz 9-box
- [x] Filtros por departamento y tipo evaluación
- [x] Generación de enlaces públicos
- [x] KPIs con umbrales de color
- [x] Metas SMART
- [x] Flujo de revisión/aprobación
- [x] Gráficas de araña y pie
- [x] Evaluación manual (override directo)
- [x] Formulario público multi-step

## Tech Stack
- React.js + React Router
- Recharts (gráficas)
- Tailwind CSS
- Lucide React (iconos)

## Testing
- 100% pruebas pasadas
- 23 tests de funcionalidad verificados

## Backlog (Cuando aprueben diseño)
- [ ] P0: Backend con MongoDB
- [ ] P0: Autenticación (Admin/Empleado)
- [ ] P1: Carga desde Excel/CSV
- [ ] P1: Historial de evaluaciones
- [ ] P1: Notificaciones por email
- [ ] P2: Reportes exportables

---
*Última actualización: Enero 2026*
*Estado: Mockups v3 completos - Pendiente aprobación*
