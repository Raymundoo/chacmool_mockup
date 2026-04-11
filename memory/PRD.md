# EvalPro - Sistema de Evaluación de Empleados

## Problem Statement Original
Sistema web de evaluación de empleados que combina:
- KPIs (resultados cuantitativos, 0-100)
- Evaluación 360 (valores/habilidades blandas, 0-100)

Los resultados clasifican empleados en matriz 9-box personalizada con categorías:
- A → verde (top performer)
- B1–B4 → tonos amarillo/naranja
- C1–C4 → tonos naranja/rojo (C4 el peor)

## Fase Actual
**MOCKUPS/DISEÑO VISUAL v2** - Pendiente de aprobación

## Vistas Implementadas (9 vistas totales)

### NUEVAS VISTAS (v2)

#### 1. Dashboard General (/)
- Estadísticas: Total empleados, Promedio KPI, Top Performers, Requieren Atención
- Matriz 9-box con conteo de empleados por celda
- Mini avatares de empleados en cada celda
- Filtro por departamento
- Resumen por departamento con barras de progreso
- Actividad reciente

#### 2. Listado de Empleados (/employees)
- Tabla completa con foto, nombre, puesto, departamento, KPI, 360, clasificación
- Búsqueda por nombre, puesto o ID
- Filtro por departamento (6 departamentos)
- Filtro por clasificación (A, B1-B4, C1-C4)
- Botones de acción: Ver perfil, Evaluar
- Botón "Agregar Empleado"

#### 3. Gestión de Evaluaciones (/evaluations)
- Lista de plantillas disponibles (360 y KPI)
- Detalle de plantilla seleccionada
- **Edición de pesos configurable** para categorías y preguntas
- Indicador visual de peso total (debe sumar 100%)
- Estados: Activa/Inactiva
- Botón "Nueva Evaluación"

### VISTAS ACTUALIZADAS

#### 4. Ingreso de Resultados (/entry)
- **Selector dropdown de empleado**
- **Selector dropdown de evaluación a aplicar**
- Sliders de KPI y 360 con código de colores
- Override manual de clasificación
- Vista previa de matriz 9-box en tiempo real

### VISTAS EXISTENTES

#### 5. Perfil de Empleado (/profile)
#### 6. Evaluación 360 (/360)
#### 7. Evaluación KPI (/kpi)
#### 8. Autoevaluación (/self)
#### 9. Matriz 9-Box (/matrix)

## Datos Mock

### Empleados (8 total)
- María García López - Senior Developer - Tecnología
- Juan Rodríguez Pérez - Product Manager - Producto
- Laura Sánchez Ruiz - UX Designer - Diseño
- Carlos Mendoza - Tech Lead - Tecnología
- Ana Martínez - Head of Product - Producto
- Roberto Díaz - Sales Manager - Ventas
- Patricia Luna - Marketing Specialist - Marketing
- Fernando Torres - HR Coordinator - Recursos Humanos

### Departamentos (6)
- Tecnología, Producto, Diseño, Ventas, Marketing, Recursos Humanos

### Plantillas de Evaluación (3)
1. Evaluación Estándar 2024 (360) - Activa
2. KPIs Comerciales Q1 2024 (KPI) - Activa
3. Evaluación Técnica (360) - Inactiva

## Tech Stack
- React.js con React Router
- Tailwind CSS
- Lucide React (iconos)
- Diseño tipo SaaS moderno

## What's Implemented ✅
- [x] 9 vistas mockup interactivas
- [x] Dashboard con distribución en matriz
- [x] Listado con filtros múltiples
- [x] Gestión de evaluaciones con pesos editables
- [x] Selector de empleado y evaluación
- [x] Relación empleados-departamentos
- [x] Navegación completa
- [x] 100% pruebas pasadas

## Backlog (Pendiente de Aprobación)
- [ ] P0: Backend con MongoDB para persistencia
- [ ] P0: Autenticación (Admin/Empleado)
- [ ] P1: Carga desde Excel/CSV
- [ ] P1: Historial de evaluaciones
- [ ] P1: CRUD completo de empleados y evaluaciones
- [ ] P2: Reportes y exportación
- [ ] P2: Notificaciones

## Next Steps
1. Obtener aprobación del diseño visual
2. Si aprobado: implementar backend funcional
3. Definir roles y permisos exactos
4. Integrar carga de datos desde Excel

---
*Última actualización: Enero 2026*
*Estado: Mockups v2 completados, pendiente revisión*
