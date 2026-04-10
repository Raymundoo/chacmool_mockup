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
**MOCKUPS/DISEÑO VISUAL** - Pendiente de aprobación

## Vistas Implementadas (Mockups Interactivos)

### 1. Ingreso de Resultados (Vista Principal)
- Selección de empleado con cards
- Slider de KPI (0-100) con código de colores
- Slider de Evaluación 360 (0-100)
- Override manual de clasificación
- Vista previa de matriz 9-box en tiempo real
- Clasificación resultante dinámica

### 2. Perfil de Empleado
- Banner/cover con foto de perfil
- Información personal (ID, puesto, departamento, fecha ingreso)
- Datos de contacto
- Resultado calculado y override

### 3. Evaluación 360
- Cuestionario por categorías: Comunicación, Trabajo en Equipo, Liderazgo
- Botones de rating 1-5 por pregunta
- Cálculo automático de score por categoría y total

### 4. Evaluación KPI
- Lista de KPIs con pesos porcentuales
- Sliders con barras de progreso
- Cálculo ponderado automático

### 5. Autoevaluación
- Cuestionario corto con 5 preguntas
- Botones de rating 1-5
- Opción de override manual del score

### 6. Matriz 9-Box
- Grid visual 3x3 interactivo
- Descripción detallada al seleccionar celda
- Leyenda de colores
- Rangos de KPI y Valores por celda

## Tech Stack
- React.js con React Router
- Tailwind CSS
- Lucide React (iconos)
- Diseño tipo SaaS moderno (Linear, Stripe, Notion)

## Decisiones de Diseño
- Tipografía: Outfit (headings) + Manrope (body)
- Colores: Slate palette con acentos semánticos
- Layout: Sidebar fijo + contenido principal scrollable
- Cards con bordes redondeados y sombras suaves

## What's Implemented ✅
- [x] Todas las 6 vistas mockup interactivas
- [x] Lógica de clasificación 9-box
- [x] Sliders y controles funcionales
- [x] Navegación completa
- [x] Datos mock de empleados
- [x] Diseño responsive

## Backlog (Pendiente de Aprobación)
- [ ] P0: Backend con MongoDB para persistencia
- [ ] P0: Autenticación (Admin/Empleado)
- [ ] P1: Carga desde Excel/CSV
- [ ] P1: Historial de evaluaciones
- [ ] P2: Reportes y exportación
- [ ] P2: Dashboard administrativo

## Next Steps
1. Obtener aprobación del diseño visual
2. Si aprobado: implementar backend funcional
3. Definir roles y permisos exactos
4. Integrar carga de datos desde Excel

---
*Última actualización: Enero 2026*
*Estado: Mockups completados, pendiente revisión*
