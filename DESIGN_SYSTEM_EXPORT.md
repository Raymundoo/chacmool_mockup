# 🎨 Sistema de Diseño - EvalPro (Exportación)

Este documento contiene todos los estilos, patrones y configuraciones del sistema de diseño utilizado en el proyecto de Evaluación de Empleados. Úsalo como referencia para replicar el diseño en otros proyectos.

---

## 📋 Índice
1. [Configuración Base](#configuración-base)
2. [Sistema de Colores](#sistema-de-colores)
3. [Tipografía](#tipografía)
4. [Espaciado y Layout](#espaciado-y-layout)
5. [Componentes UI](#componentes-ui)
6. [Patrones de Diseño](#patrones-de-diseño)
7. [Iconografía](#iconografía)
8. [Estados Interactivos](#estados-interactivos)
9. [Animaciones y Transiciones](#animaciones-y-transiciones)
10. [Prompt de Implementación](#prompt-de-implementación)

---

## 🔧 Configuración Base

### Stack Tecnológico
- **Framework CSS:** Tailwind CSS v3.x
- **Framework JS:** React 18
- **Iconos:** Lucide React
- **Fuentes:** Inter (Google Fonts)

### Instalación de Dependencias
```bash
# Tailwind CSS
yarn add -D tailwindcss postcss autoprefixer
yarn add tailwindcss-animate

# Lucide React Icons
yarn add lucide-react

# Fuentes (agregar en HTML)
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

### Tailwind Config (tailwind.config.js)
```javascript
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: '0.75rem',      // 12px
        md: '0.5rem',       // 8px
        sm: '0.375rem'      // 6px
      },
      colors: {
        // Colores personalizados si los tienes
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
```

---

## 🎨 Sistema de Colores

### Paleta Principal

**Grises (Slate)**
```css
/* Fondos */
bg-slate-50    /* #f8fafc - Fondo general de página */
bg-slate-100   /* #f1f5f9 - Fondo de sidebar activo */
bg-slate-900   /* #0f172a - Botones primarios, texto principal */

/* Bordes */
border-slate-200  /* #e2e8f0 - Bordes de cards, inputs */
border-slate-300  /* #cbd5e1 - Bordes destacados */

/* Texto */
text-slate-900  /* #0f172a - Títulos principales */
text-slate-700  /* #334155 - Labels de formulario */
text-slate-600  /* #475569 - Texto secundario */
text-slate-500  /* #64748b - Texto terciario, placeholders */
text-slate-400  /* #94a3b8 - Iconos deshabilitados */
```

**Colores de Acento**
```css
/* Azul (Primary) */
bg-blue-600     /* #2563eb - Links, tabs activos */
text-blue-600   /* #2563eb - Enlaces, estado activo */
border-blue-600 /* #2563eb - Bordes de elementos activos */

/* Morado (Secondary) */
bg-purple-600   /* #9333ea - Puntuaciones de valores */
text-purple-600 /* #9333ea - Indicadores especiales */

/* Verde (Success/Work) */
bg-teal-500     /* #14b8a6 - Trabajo normal, éxito */
bg-green-500    /* #22c55e - Confirmaciones */

/* Naranja (Warning/Break) */
bg-orange-400   /* #fb923c - Descansos, advertencias */

/* Rojo (Error) */
bg-red-500      /* #ef4444 - Errores, eliminación */
text-red-600    /* #dc2626 - Mensajes de error */

/* Blanco */
bg-white        /* #ffffff - Cards, modales */
```

### Uso por Contexto

**Fondos de Página**
```jsx
<div className="min-h-screen bg-slate-50">
```

**Cards y Contenedores**
```jsx
<div className="bg-white border border-slate-200 rounded-xl p-6">
```

**Botones Primarios**
```jsx
<button className="bg-slate-900 text-white hover:bg-slate-800">
```

**Botones Secundarios**
```jsx
<button className="border border-slate-200 text-slate-700 hover:bg-slate-50">
```

---

## 📝 Tipografía

### Configuración de Fuentes
```html
<!-- En index.html -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

### Jerarquía Tipográfica

**Títulos Principales (H1)**
```jsx
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900">
  Título Principal
</h1>
```

**Subtítulos (H2)**
```jsx
<h2 className="text-xl font-semibold text-slate-900">
  Subtítulo
</h2>
```

**Títulos de Sección (H3)**
```jsx
<h3 className="text-lg font-semibold text-slate-900">
  Título de Sección
</h3>
```

**Texto de Cuerpo**
```jsx
<p className="text-base text-slate-700">
  Texto normal de cuerpo
</p>
```

**Texto Secundario**
```jsx
<p className="text-sm text-slate-500">
  Texto secundario o descriptivo
</p>
```

**Texto Pequeño (Labels, Captions)**
```jsx
<span className="text-xs text-slate-400">
  Texto muy pequeño
</span>
```

### Pesos de Fuente
```css
font-normal    /* 400 - Texto normal */
font-medium    /* 500 - Énfasis suave */
font-semibold  /* 600 - Títulos, botones */
font-bold      /* 700 - Títulos principales */
```

---

## 📏 Espaciado y Layout

### Sistema de Espaciado Tailwind
```css
/* Espaciado (1 unidad = 0.25rem = 4px) */
p-2   /* 8px */
p-3   /* 12px */
p-4   /* 16px */
p-6   /* 24px */
p-8   /* 32px */

gap-2  /* 8px entre elementos */
gap-4  /* 16px entre elementos */
gap-6  /* 24px entre elementos */
```

### Contenedores Estándar

**Container Responsive**
```jsx
<div className="container mx-auto px-8 py-6">
  {/* Contenido que se adapta al viewport */}
</div>
```

**Container de Ancho Fijo**
```jsx
<div className="max-w-7xl mx-auto px-6 py-6">
  {/* Máximo 1280px de ancho */}
</div>
```

**Sidebar + Contenido**
```jsx
<div className="flex gap-6">
  {/* Sidebar */}
  <div className="w-64 flex-shrink-0">
    {/* 256px de ancho fijo */}
  </div>
  
  {/* Contenido principal */}
  <div className="flex-1">
    {/* Toma el resto del espacio */}
  </div>
</div>
```

### Bordes Redondeados
```css
rounded-lg   /* 12px - Cards grandes */
rounded-xl   /* 16px - Contenedores principales */
rounded-full /* Círculos perfectos (avatares, badges) */
```

---

## 🧩 Componentes UI

### 1. Botones

**Botón Primario**
```jsx
<button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
  <Icon className="w-4 h-4" />
  Texto del Botón
</button>
```

**Botón Secundario**
```jsx
<button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
  <Icon className="w-4 h-4" />
  Texto del Botón
</button>
```

**Botón de Icono Circular**
```jsx
<button className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors">
  <Icon className="w-5 h-5" />
</button>
```

**Botón Destructivo**
```jsx
<button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
  Eliminar
</button>
```

### 2. Inputs y Formularios

**Input de Texto**
```jsx
<div>
  <label className="block text-sm font-medium text-slate-700 mb-2">
    Nombre del Campo *
  </label>
  <input
    type="text"
    placeholder="Placeholder text"
    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
  />
</div>
```

**Input Deshabilitado**
```jsx
<input
  type="text"
  disabled
  className="w-full px-3 py-2 border border-slate-200 rounded-lg disabled:bg-slate-50 disabled:text-slate-500"
/>
```

**Select / Dropdown**
```jsx
<select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900">
  <option value="">Selecciona una opción</option>
  <option value="1">Opción 1</option>
  <option value="2">Opción 2</option>
</select>
```

**Checkbox**
```jsx
<label className="flex items-center gap-2">
  <input
    type="checkbox"
    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
  />
  <span className="text-sm text-slate-700">Texto del checkbox</span>
</label>
```

**Input con Icono**
```jsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
  <input
    type="text"
    placeholder="Buscar..."
    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg"
  />
</div>
```

### 3. Cards

**Card Básico**
```jsx
<div className="bg-white border border-slate-200 rounded-xl p-6">
  <h3 className="text-lg font-semibold text-slate-900 mb-2">
    Título del Card
  </h3>
  <p className="text-sm text-slate-500">
    Contenido del card
  </p>
</div>
```

**Card con Sombra**
```jsx
<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
  {/* Contenido */}
</div>
```

**Card Hover**
```jsx
<div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer">
  {/* Contenido */}
</div>
```

### 4. Tabs / Navegación

**Tabs Horizontales**
```jsx
<div className="flex gap-4 border-b border-slate-200">
  {/* Tab Activo */}
  <button className="flex items-center gap-2 px-2 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
    <Icon className="w-4 h-4" />
    Tab Activo
  </button>
  
  {/* Tab Inactivo */}
  <button className="flex items-center gap-2 px-2 py-3 text-sm font-medium text-slate-600 border-b-2 border-transparent hover:text-slate-900">
    <Icon className="w-4 h-4" />
    Tab Inactivo
  </button>
</div>
```

**Sidebar Navigation**
```jsx
<div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1">
  {/* Item Activo */}
  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-100 text-slate-900 font-medium">
    <Icon className="w-4 h-4" />
    Item Activo
  </button>
  
  {/* Item Inactivo */}
  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900">
    <Icon className="w-4 h-4" />
    Item Inactivo
  </button>
</div>
```

### 5. Avatares

**Avatar Pequeño**
```jsx
<img
  src="/path/to/avatar.jpg"
  alt="Nombre"
  className="w-10 h-10 rounded-full object-cover"
/>
```

**Avatar Grande (Perfil)**
```jsx
<div className="relative">
  <img
    src="/path/to/avatar.jpg"
    alt="Nombre"
    className="w-56 h-56 rounded-full object-cover border-4 border-white shadow-xl"
  />
  {/* Botón de edición */}
  <button className="absolute bottom-2 right-2 w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg">
    <Edit2 className="w-5 h-5" />
  </button>
</div>
```

### 6. Badges / Pills

**Badge de Estado**
```jsx
<span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium">
  Estado Activo
</span>
```

**Badge de Clasificación**
```jsx
<span className="px-3 py-1 rounded-lg font-bold text-sm" style={{ backgroundColor: '#colorBg', color: '#colorText' }}>
  A1
</span>
```

### 7. Tablas

**Tabla Responsive**
```jsx
<div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
  <table className="w-full">
    <thead className="bg-slate-50 border-b border-slate-200">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
          Columna
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
      <tr className="hover:bg-slate-50">
        <td className="px-6 py-4 text-sm text-slate-900">
          Contenido
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### 8. Estados Vacíos

**Empty State con Ilustración**
```jsx
<div className="text-center py-16">
  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
    <Icon className="w-8 h-8 text-slate-400" />
  </div>
  <h3 className="text-lg font-semibold text-slate-900 mb-2">
    No hay datos disponibles
  </h3>
  <p className="text-sm text-slate-500">
    Descripción del estado vacío
  </p>
</div>
```

### 9. Dropdowns

**Dropdown con Búsqueda**
```jsx
<div className="relative">
  <input
    type="text"
    placeholder="Buscar..."
    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
  />
  
  {/* Dropdown Results */}
  <div className="absolute mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left">
      <img src="/avatar.jpg" className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-900">Nombre</div>
        <div className="text-xs text-slate-500">Descripción</div>
      </div>
    </button>
  </div>
</div>
```

---

## 🎯 Patrones de Diseño

### Layout Principal (Header + Sidebar + Contenido)

```jsx
<div className="min-h-screen bg-slate-50">
  {/* Header */}
  <div className="bg-white border-b border-slate-200">
    <div className="container mx-auto px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <img src="/logo.png" className="w-12 h-12" />
          <h1 className="text-lg font-semibold">Título</h1>
        </div>
        
        {/* Right side */}
        <div className="flex items-center gap-4">
          <button>Acción</button>
        </div>
      </div>
    </div>
  </div>
  
  {/* Main Content */}
  <div className="container mx-auto px-8 py-6">
    <div className="flex gap-6">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0">
        {/* Sidebar content */}
      </aside>
      
      {/* Main */}
      <main className="flex-1">
        {/* Page content */}
      </main>
    </div>
  </div>
</div>
```

### Grid Responsivo (Cards)

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item) => (
    <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-6">
      {/* Card content */}
    </div>
  ))}
</div>
```

### Formulario de Dos Columnas

```jsx
<div className="space-y-6">
  <h2 className="text-xl font-semibold text-slate-900">Título del Formulario</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Campo 1 */}
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Campo 1 *
      </label>
      <input
        type="text"
        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
      />
    </div>
    
    {/* Campo 2 */}
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Campo 2
      </label>
      <input
        type="text"
        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
      />
    </div>
    
    {/* Campo Full Width */}
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Campo Completo
      </label>
      <input
        type="text"
        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
      />
    </div>
  </div>
  
  {/* Botones de Acción */}
  <div className="flex gap-3 justify-end">
    <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">
      Cancelar
    </button>
    <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
      Guardar
    </button>
  </div>
</div>
```

---

## 🎭 Iconografía

### Librería Utilizada: Lucide React

**Instalación**
```bash
yarn add lucide-react
```

**Iconos Principales del Proyecto**
```jsx
import {
  User,           // Perfil, usuarios
  Briefcase,      // Datos laborales
  FileText,       // Documentos, contratos
  Calendar,       // Fechas, ausencias
  Target,         // Objetivos, KPIs
  ClipboardList,  // Listas, evaluaciones
  Clock,          // Tiempo, fichajes
  CheckSquare,    // Tareas completadas
  BarChart3,      // Estadísticas, gráficos
  Settings,       // Configuración
  Shield,         // Seguridad, roles
  Users,          // Grupos, equipos
  GraduationCap,  // Formación
  Map,            // Journey, rutas
  Lock,           // Accesos
  Zap,            // Automatizaciones
  Edit2,          // Edición
  Save,           // Guardar
  X,              // Cerrar, cancelar
  Search,         // Búsqueda
  ArrowLeft,      // Volver
  ChevronDown     // Dropdown
} from 'lucide-react';
```

**Tamaños Estándar**
```jsx
<Icon className="w-4 h-4" />   {/* 16px - Iconos pequeños (botones, tabs) */}
<Icon className="w-5 h-5" />   {/* 20px - Iconos medianos (sidebar) */}
<Icon className="w-6 h-6" />   {/* 24px - Iconos grandes (headers) */}
<Icon className="w-8 h-8" />   {/* 32px - Iconos extra grandes (empty states) */}
```

---

## ⚡ Estados Interactivos

### Hover States
```css
/* Botones */
hover:bg-slate-800        /* Botones primarios */
hover:bg-slate-50         /* Botones secundarios */
hover:shadow-md           /* Cards */
hover:text-slate-900      /* Links */

/* Transiciones suaves */
transition-colors         /* Cambio de color */
transition-shadow         /* Cambio de sombra */
transition-all            /* Todo junto */
```

### Focus States
```css
focus:ring-2              /* Anillo de enfoque */
focus:ring-slate-900      /* Color del anillo */
focus:border-transparent  /* Quitar borde al enfocar */
focus:outline-none        /* Quitar outline por defecto */
```

### Disabled States
```css
disabled:bg-slate-50      /* Fondo deshabilitado */
disabled:text-slate-500   /* Texto deshabilitado */
disabled:opacity-50       /* Opacidad reducida */
disabled:cursor-not-allowed
```

### Active States
```css
/* Tabs activos */
border-blue-600 text-blue-600

/* Sidebar activo */
bg-slate-100 text-slate-900 font-medium
```

---

## 🌊 Animaciones y Transiciones

### Transiciones Estándar
```jsx
className="transition-colors duration-200"   // Cambio de color suave
className="transition-shadow duration-300"   // Cambio de sombra
className="transition-all duration-200"      // Transición general
```

### Hover con Escala
```jsx
className="transform hover:scale-105 transition-transform"
```

### Fade In (con Tailwind Animate)
```jsx
className="animate-in fade-in duration-500"
```

---

## 🚀 Prompt de Implementación Completo

### Para usar en otro proyecto, proporciona este prompt a un agente AI:

---

**PROMPT DE DISEÑO - SISTEMA EVALPRO**

Implementa un sistema de diseño moderno y profesional con las siguientes especificaciones:

**Stack Tecnológico:**
- React 18
- Tailwind CSS v3.x
- Lucide React (iconos)
- Fuente: Inter de Google Fonts (pesos 400, 500, 600, 700)

**Paleta de Colores:**
- **Grises principales:** slate-50 (fondo), slate-900 (texto principal/botones)
- **Bordes:** border-slate-200
- **Acento primario:** blue-600
- **Acento secundario:** purple-600
- **Success/Work:** teal-500
- **Warning:** orange-400
- **Error:** red-500

**Tipografía:**
```
H1: text-4xl sm:text-5xl lg:text-6xl font-bold
H2: text-xl font-semibold
H3: text-lg font-semibold
Body: text-base
Secondary: text-sm text-slate-500
Small: text-xs text-slate-400
```

**Componentes Clave:**

1. **Botón Primario:**
```jsx
<button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
  Texto
</button>
```

2. **Input de Texto:**
```jsx
<input className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
```

3. **Card:**
```jsx
<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
  Contenido
</div>
```

4. **Tab Activo:**
```jsx
<button className="px-2 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
  Tab
</button>
```

5. **Avatar Grande:**
```jsx
<img className="w-56 h-56 rounded-full object-cover border-4 border-white shadow-xl" />
```

**Layout Estándar:**
- Container: `container mx-auto px-8 py-6`
- Sidebar: `w-64 flex-shrink-0`
- Grid Cards: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

**Estados Interactivos:**
- Hover: `hover:bg-slate-800 hover:shadow-md`
- Focus: `focus:ring-2 focus:ring-slate-900`
- Disabled: `disabled:bg-slate-50 disabled:text-slate-500`
- Transiciones: `transition-colors duration-200`

**Bordes Redondeados:**
- Cards grandes: `rounded-xl` (16px)
- Botones/inputs: `rounded-lg` (12px)
- Avatares: `rounded-full`

**Espaciado:**
- Entre elementos: `gap-4` o `gap-6`
- Padding de cards: `p-6`
- Margin entre secciones: `space-y-6`

**Iconos (Lucide React):**
- Tamaño pequeño: `w-4 h-4`
- Tamaño mediano: `w-5 h-5`
- Tamaño grande: `w-8 h-8`

**Sombras:**
- Ligera: `shadow-md`
- Media: `shadow-lg`
- Fuerte: `shadow-xl`

**Empty States:**
```jsx
<div className="text-center py-16">
  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
    <Icon className="w-8 h-8 text-slate-400" />
  </div>
  <h3 className="text-lg font-semibold text-slate-900 mb-2">Título</h3>
  <p className="text-sm text-slate-500">Descripción</p>
</div>
```

**Principios de Diseño:**
- Usar `bg-white` para cards sobre fondo `bg-slate-50`
- Bordes sutiles con `border-slate-200`
- Transiciones suaves en todos los estados hover
- Espaciado consistente con sistema de 4px (gap-2, gap-4, gap-6, etc.)
- Texto principal en `text-slate-900`, secundario en `text-slate-500`
- Botones primarios en `bg-slate-900`, secundarios con `border-slate-200`
- Focus states con `ring-2 ring-slate-900`

Implementa este sistema de diseño manteniendo consistencia en todos los componentes y páginas.

---

## 📦 Checklist de Implementación

Cuando implementes este diseño en un nuevo proyecto, asegúrate de:

- [ ] Instalar Tailwind CSS y tailwindcss-animate
- [ ] Instalar Lucide React
- [ ] Agregar fuente Inter en HTML
- [ ] Configurar tailwind.config.js con borderRadius custom
- [ ] Crear componentes base (Button, Input, Card, etc.)
- [ ] Definir variables de color en un archivo central
- [ ] Implementar layout principal (Header + Sidebar + Content)
- [ ] Configurar estados hover/focus/disabled consistentemente
- [ ] Agregar transiciones suaves a todos los elementos interactivos
- [ ] Crear empty states reutilizables
- [ ] Implementar grid responsivo para cards
- [ ] Probar en diferentes resoluciones

---

## 🎨 Extras: Componentes Avanzados

### Timeline Gantt (Fichajes)
```jsx
<div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
  <div className="overflow-x-auto">
    <div className="min-w-[800px]">
      {/* Header de horas */}
      <div className="flex border-b border-slate-200">
        <div className="w-48 flex-shrink-0 px-4 py-3 bg-slate-50 font-medium text-xs text-slate-600">
          Fecha / Horas
        </div>
        <div className="flex-1 flex">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="flex-1 text-center text-xs text-slate-400 py-3 border-l border-slate-100">
              {i}:00
            </div>
          ))}
        </div>
      </div>
      
      {/* Filas de días */}
      <div className="flex border-b border-slate-100 hover:bg-slate-50">
        <div className="w-48 flex-shrink-0 px-4 py-4">
          <div className="text-sm font-medium text-slate-900">Fecha</div>
          <div className="text-xs text-slate-500">Horas</div>
        </div>
        <div className="flex-1 relative py-4">
          {/* Segmentos de tiempo */}
          <div
            className="absolute h-6 bg-teal-500 rounded"
            style={{ left: '37.5%', width: '33.33%', top: '50%', transform: 'translateY(-50%)' }}
          />
        </div>
      </div>
    </div>
  </div>
</div>
```

### Modal / Overlay
```jsx
{isOpen && (
  <>
    {/* Overlay */}
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
    
    {/* Modal */}
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Título del Modal</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Contenido del modal */}
          <div className="space-y-4">
            {/* ... */}
          </div>
          
          {/* Botones de acción */}
          <div className="flex gap-3 justify-end mt-6">
            <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">
              Cancelar
            </button>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)}
```

---

## 📄 Conclusión

Este sistema de diseño está optimizado para:
- **Consistencia visual** en toda la aplicación
- **Accesibilidad** con focus states claros
- **Responsividad** en todos los dispositivos
- **Mantenibilidad** con patrones reutilizables
- **Escalabilidad** fácil de extender

Usa este documento como referencia única para replicar el diseño en cualquier proyecto futuro.

---

**Versión:** 1.0  
**Fecha:** Abril 2026  
**Proyecto:** EvalPro - Sistema de Evaluación de Empleados
