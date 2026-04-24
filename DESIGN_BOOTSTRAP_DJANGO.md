# 🎨 Sistema de Diseño EvalPro - Bootstrap + Django

Este documento contiene todos los estilos y componentes del proyecto EvalPro adaptados para **Bootstrap 5** y **Django**. Úsalo como referencia para replicar el diseño en proyectos Django.

---

## 📋 Índice
1. [Configuración Django + Bootstrap](#configuración-django--bootstrap)
2. [Sistema de Colores (CSS Variables)](#sistema-de-colores-css-variables)
3. [Tipografía](#tipografía)
4. [Componentes Bootstrap](#componentes-bootstrap)
5. [Layouts y Grid](#layouts-y-grid)
6. [Custom CSS](#custom-css)
7. [Iconografía](#iconografía)
8. [Prompt de Implementación](#prompt-de-implementación)

---

## 🔧 Configuración Django + Bootstrap

### 1. Instalación de Bootstrap

**Opción A: CDN (Más rápido)**

Agrega en tu `base.html`:

```html
<!-- En tu templates/base.html -->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}EvalPro{% endblock %}</title>
    
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Google Fonts - Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    
    <!-- Custom CSS -->
    <link href="{% static 'css/custom.css' %}" rel="stylesheet">
    
    {% block extra_css %}{% endblock %}
</head>
<body>
    {% block content %}{% endblock %}
    
    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    
    {% block extra_js %}{% endblock %}
</body>
</html>
```

**Opción B: NPM + Django Static (Producción)**

```bash
npm install bootstrap@5.3.2 bootstrap-icons
```

Luego configura en `settings.py`:

```python
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
    BASE_DIR / 'node_modules',
]
```

---

## 🎨 Sistema de Colores (CSS Variables)

### Archivo: `static/css/custom.css`

```css
:root {
  /* Colores Principales - Grises (Slate) */
  --bs-gray-50: #f8fafc;
  --bs-gray-100: #f1f5f9;
  --bs-gray-200: #e2e8f0;
  --bs-gray-300: #cbd5e1;
  --bs-gray-400: #94a3b8;
  --bs-gray-500: #64748b;
  --bs-gray-600: #475569;
  --bs-gray-700: #334155;
  --bs-gray-800: #1e293b;
  --bs-gray-900: #0f172a;
  
  /* Colores de Acento */
  --bs-primary: #0f172a;        /* Slate 900 */
  --bs-secondary: #64748b;      /* Slate 500 */
  --bs-success: #14b8a6;        /* Teal 500 */
  --bs-info: #2563eb;           /* Blue 600 */
  --bs-warning: #fb923c;        /* Orange 400 */
  --bs-danger: #ef4444;         /* Red 500 */
  --bs-light: #f8fafc;          /* Slate 50 */
  --bs-dark: #0f172a;           /* Slate 900 */
  
  /* Colores Específicos del Proyecto */
  --color-accent-blue: #2563eb;
  --color-accent-purple: #9333ea;
  --color-work-normal: #14b8a6;
  --color-work-extended: #3b82f6;
  --color-break: #fb923c;
  
  /* Bordes */
  --bs-border-color: #e2e8f0;
  --bs-border-radius: 0.75rem;
  --bs-border-radius-lg: 1rem;
  --bs-border-radius-xl: 1.25rem;
  
  /* Sombras */
  --bs-box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --bs-box-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --bs-box-shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  /* Tipografía */
  --bs-body-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --bs-body-font-size: 1rem;
  --bs-body-font-weight: 400;
  --bs-body-line-height: 1.5;
  --bs-body-color: #334155;
  --bs-body-bg: #f8fafc;
}

/* Aplicar fuente globalmente */
body {
  font-family: var(--bs-body-font-family);
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
}

/* Clases de utilidad personalizadas */
.bg-slate-50 { background-color: var(--bs-gray-50) !important; }
.bg-slate-100 { background-color: var(--bs-gray-100) !important; }
.bg-slate-900 { background-color: var(--bs-gray-900) !important; }

.text-slate-400 { color: var(--bs-gray-400) !important; }
.text-slate-500 { color: var(--bs-gray-500) !important; }
.text-slate-600 { color: var(--bs-gray-600) !important; }
.text-slate-700 { color: var(--bs-gray-700) !important; }
.text-slate-900 { color: var(--bs-gray-900) !important; }

.border-slate-200 { border-color: var(--bs-gray-200) !important; }

.rounded-xl { border-radius: var(--bs-border-radius-xl) !important; }
.shadow-lg { box-shadow: var(--bs-box-shadow-lg) !important; }
.shadow-xl { box-shadow: var(--bs-box-shadow-xl) !important; }
```

---

## 📝 Tipografía

### Jerarquía Tipográfica

**En tu CSS custom:**

```css
/* Títulos */
h1, .h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--bs-gray-900);
  line-height: 1.2;
}

h2, .h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--bs-gray-900);
  line-height: 1.3;
}

h3, .h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--bs-gray-900);
  line-height: 1.4;
}

/* Texto de cuerpo */
.text-body {
  font-size: 1rem;
  color: var(--bs-gray-700);
}

.text-secondary-custom {
  font-size: 0.875rem;
  color: var(--bs-gray-500);
}

.text-small {
  font-size: 0.75rem;
  color: var(--bs-gray-400);
}

/* Responsive */
@media (min-width: 768px) {
  h1, .h1 { font-size: 3rem; }
  h2, .h2 { font-size: 2rem; }
}

@media (min-width: 992px) {
  h1, .h1 { font-size: 3.5rem; }
}
```

**Uso en Django Templates:**

```html
<h1 class="mb-3">Título Principal</h1>
<h2 class="mb-3">Subtítulo</h2>
<h3 class="mb-2">Título de Sección</h3>
<p class="text-body">Texto normal de cuerpo</p>
<p class="text-secondary-custom">Texto secundario</p>
<small class="text-small">Texto pequeño</small>
```

---

## 🧩 Componentes Bootstrap

### 1. Botones

**CSS Custom para Botones:**

```css
/* Botón Primario (Dark) */
.btn-primary-custom {
  background-color: var(--bs-gray-900);
  border-color: var(--bs-gray-900);
  color: white;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--bs-border-radius);
  transition: all 0.2s ease;
}

.btn-primary-custom:hover {
  background-color: var(--bs-gray-800);
  border-color: var(--bs-gray-800);
  color: white;
}

/* Botón Secundario (Outline) */
.btn-secondary-custom {
  background-color: white;
  border: 1px solid var(--bs-gray-200);
  color: var(--bs-gray-700);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--bs-border-radius);
  transition: all 0.2s ease;
}

.btn-secondary-custom:hover {
  background-color: var(--bs-gray-50);
  border-color: var(--bs-gray-200);
  color: var(--bs-gray-700);
}

/* Botón Circular de Icono */
.btn-icon-circle {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Botón Destructivo */
.btn-danger-custom {
  background-color: #ef4444;
  border-color: #ef4444;
  color: white;
}

.btn-danger-custom:hover {
  background-color: #dc2626;
  border-color: #dc2626;
}
```

**Uso en Django Templates:**

```html
<!-- Botón Primario -->
<button type="button" class="btn btn-primary-custom">
  <i class="bi bi-plus-circle me-2"></i>
  Texto del Botón
</button>

<!-- Botón Secundario -->
<button type="button" class="btn btn-secondary-custom">
  Cancelar
</button>

<!-- Botón de Icono Circular -->
<button type="button" class="btn btn-primary-custom btn-icon-circle">
  <i class="bi bi-pencil"></i>
</button>

<!-- Botón Destructivo -->
<button type="button" class="btn btn-danger-custom">
  Eliminar
</button>
```

### 2. Formularios

**CSS Custom para Inputs:**

```css
.form-control-custom {
  border-color: var(--bs-gray-200);
  border-radius: var(--bs-border-radius);
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  color: var(--bs-gray-900);
}

.form-control-custom:focus {
  border-color: var(--bs-gray-900);
  box-shadow: 0 0 0 0.2rem rgba(15, 23, 42, 0.25);
}

.form-label-custom {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--bs-gray-700);
  margin-bottom: 0.5rem;
}
```

**Uso en Django Forms:**

```html
<!-- Input de Texto -->
<div class="mb-3">
  <label for="{{ form.nombre.id_for_label }}" class="form-label form-label-custom">
    Nombre *
  </label>
  <input 
    type="text" 
    class="form-control form-control-custom" 
    id="{{ form.nombre.id_for_label }}"
    name="{{ form.nombre.name }}"
    placeholder="Ingresa tu nombre"
  >
</div>

<!-- Select / Dropdown -->
<div class="mb-3">
  <label for="{{ form.estado.id_for_label }}" class="form-label form-label-custom">
    Estado Civil
  </label>
  <select class="form-select form-control-custom" id="{{ form.estado.id_for_label }}">
    <option value="">Selecciona una opción</option>
    <option value="soltero">Soltero/a</option>
    <option value="casado">Casado/a</option>
  </select>
</div>

<!-- Checkbox -->
<div class="mb-3 form-check">
  <input type="checkbox" class="form-check-input" id="compartirCumple">
  <label class="form-check-label text-secondary-custom" for="compartirCumple">
    Compartir cumpleaños
  </label>
</div>

<!-- Input con Icono -->
<div class="mb-3 position-relative">
  <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400"></i>
  <input 
    type="text" 
    class="form-control form-control-custom ps-5" 
    placeholder="Buscar..."
  >
</div>
```

### 3. Cards

**CSS Custom para Cards:**

```css
.card-custom {
  background-color: white;
  border: 1px solid var(--bs-gray-200);
  border-radius: var(--bs-border-radius-xl);
  box-shadow: var(--bs-box-shadow);
  transition: box-shadow 0.3s ease;
}

.card-custom:hover {
  box-shadow: var(--bs-box-shadow-lg);
}

.card-custom .card-body {
  padding: 1.5rem;
}

.card-custom .card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--bs-gray-900);
  margin-bottom: 0.5rem;
}

.card-custom .card-text {
  font-size: 0.875rem;
  color: var(--bs-gray-500);
}
```

**Uso en Templates:**

```html
<div class="card card-custom">
  <div class="card-body">
    <h5 class="card-title">Título del Card</h5>
    <p class="card-text">Contenido del card con descripción.</p>
    <button class="btn btn-primary-custom">Acción</button>
  </div>
</div>
```

### 4. Tabs / Navegación

**CSS Custom para Tabs:**

```css
.nav-tabs-custom {
  border-bottom: 1px solid var(--bs-gray-200);
}

.nav-tabs-custom .nav-link {
  color: var(--bs-gray-600);
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.75rem 0.5rem;
  margin-right: 1.5rem;
  transition: all 0.2s ease;
}

.nav-tabs-custom .nav-link:hover {
  color: var(--bs-gray-900);
  border-bottom-color: transparent;
}

.nav-tabs-custom .nav-link.active {
  color: var(--color-accent-blue);
  border-bottom-color: var(--color-accent-blue);
  background-color: transparent;
}

/* Sidebar Navigation */
.nav-sidebar .nav-link {
  color: var(--bs-gray-600);
  font-size: 0.875rem;
  padding: 0.625rem 0.75rem;
  border-radius: var(--bs-border-radius);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-sidebar .nav-link:hover {
  background-color: var(--bs-gray-50);
  color: var(--bs-gray-900);
}

.nav-sidebar .nav-link.active {
  background-color: var(--bs-gray-100);
  color: var(--bs-gray-900);
  font-weight: 500;
}
```

**Uso en Templates:**

```html
<!-- Tabs Horizontales -->
<ul class="nav nav-tabs nav-tabs-custom mb-4">
  <li class="nav-item">
    <a class="nav-link active" href="#perfil">
      <i class="bi bi-person me-2"></i>
      Perfil
    </a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#fichajes">
      <i class="bi bi-clock me-2"></i>
      Fichajes
    </a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#evaluaciones">
      <i class="bi bi-clipboard-check me-2"></i>
      Evaluaciones
    </a>
  </li>
</ul>

<!-- Sidebar Navigation -->
<div class="card card-custom p-3">
  <ul class="nav nav-sidebar flex-column">
    <li class="nav-item">
      <a class="nav-link active" href="#datos-personales">
        <i class="bi bi-person"></i>
        Datos personales
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#datos-laborales">
        <i class="bi bi-briefcase"></i>
        Datos laborales
      </a>
    </li>
  </ul>
</div>
```

### 5. Avatares

**CSS Custom para Avatares:**

```css
.avatar-sm {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-lg {
  width: 14rem;
  height: 14rem;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: var(--bs-box-shadow-xl);
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: var(--bs-gray-900);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--bs-box-shadow-lg);
  transition: background-color 0.2s ease;
}

.avatar-edit-btn:hover {
  background-color: var(--bs-gray-800);
}
```

**Uso en Templates:**

```html
<!-- Avatar Pequeño -->
<img src="{{ user.avatar_url }}" alt="{{ user.name }}" class="avatar-sm">

<!-- Avatar Grande con Botón de Edición -->
<div class="avatar-container text-center mb-4">
  <img src="{{ user.avatar_url }}" alt="{{ user.name }}" class="avatar-lg">
  <button class="avatar-edit-btn">
    <i class="bi bi-pencil"></i>
  </button>
</div>
<h3 class="fw-semibold text-slate-900">{{ user.name }}</h3>
<p class="text-secondary-custom">{{ user.position }}</p>
```

### 6. Badges

**CSS Custom:**

```css
.badge-custom {
  padding: 0.25rem 0.75rem;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: var(--bs-border-radius);
}

.badge-blue {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-purple {
  background-color: #f3e8ff;
  color: #7c3aed;
}

.badge-green {
  background-color: #d1fae5;
  color: #047857;
}
```

**Uso:**

```html
<span class="badge badge-custom badge-blue">Estado Activo</span>
<span class="badge badge-custom badge-purple">A1</span>
```

### 7. Tablas

**CSS Custom:**

```css
.table-custom {
  background-color: white;
  border: 1px solid var(--bs-gray-200);
  border-radius: var(--bs-border-radius-xl);
  overflow: hidden;
}

.table-custom thead {
  background-color: var(--bs-gray-50);
  border-bottom: 1px solid var(--bs-gray-200);
}

.table-custom thead th {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--bs-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.75rem 1.5rem;
  border: none;
}

.table-custom tbody tr {
  border-bottom: 1px solid var(--bs-gray-100);
  transition: background-color 0.2s ease;
}

.table-custom tbody tr:hover {
  background-color: var(--bs-gray-50);
}

.table-custom tbody td {
  padding: 1rem 1.5rem;
  color: var(--bs-gray-900);
  font-size: 0.875rem;
  border: none;
}
```

**Uso:**

```html
<div class="table-custom">
  <table class="table table-hover mb-0">
    <thead>
      <tr>
        <th>Empleado</th>
        <th class="text-center">Valores</th>
        <th class="text-center">Resultados</th>
        <th class="text-center">Clasificación</th>
      </tr>
    </thead>
    <tbody>
      {% for empleado in empleados %}
      <tr>
        <td>
          <div class="d-flex align-items-center gap-3">
            <img src="{{ empleado.avatar }}" class="avatar-sm">
            <div>
              <div class="fw-medium text-slate-900">{{ empleado.nombre }}</div>
              <div class="text-secondary-custom">{{ empleado.cargo }}</div>
            </div>
          </div>
        </td>
        <td class="text-center fw-semibold text-purple">{{ empleado.valores }}%</td>
        <td class="text-center fw-semibold text-primary">{{ empleado.resultados }}%</td>
        <td class="text-center">
          <span class="badge badge-custom badge-blue">{{ empleado.clasificacion }}</span>
        </td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>
```

### 8. Estados Vacíos

```html
<div class="text-center py-5">
  <div class="d-inline-flex align-items-center justify-content-center bg-slate-100 rounded-circle mb-3" style="width: 4rem; height: 4rem;">
    <i class="bi bi-inbox fs-2 text-slate-400"></i>
  </div>
  <h3 class="h5 fw-semibold text-slate-900 mb-2">No hay datos disponibles</h3>
  <p class="text-secondary-custom">Descripción del estado vacío</p>
</div>
```

---

## 📏 Layouts y Grid

### Layout Principal (Header + Sidebar + Contenido)

```html
<!-- base.html -->
<div class="min-vh-100 bg-slate-50">
  <!-- Header -->
  <div class="bg-white border-bottom border-slate-200">
    <div class="container-fluid px-4 py-3">
      <div class="d-flex justify-content-between align-items-center">
        <!-- Left -->
        <div class="d-flex align-items-center gap-3">
          <img src="{% static 'img/logo.png' %}" class="rounded" style="width: 3rem; height: 3rem;">
          <h1 class="h5 mb-0 fw-semibold">{{ titulo }}</h1>
        </div>
        
        <!-- Right -->
        <div class="d-flex align-items-center gap-3">
          <button class="btn btn-primary-custom">Acción</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Main Content -->
  <div class="container-fluid px-4 py-4">
    <div class="row g-4">
      <!-- Sidebar -->
      <aside class="col-lg-3 col-xl-2">
        <!-- Sidebar content -->
      </aside>
      
      <!-- Main -->
      <main class="col-lg-9 col-xl-10">
        {% block content %}{% endblock %}
      </main>
    </div>
  </div>
</div>
```

### Grid de Cards

```html
<div class="row g-4">
  {% for item in items %}
  <div class="col-12 col-md-6 col-lg-4">
    <div class="card card-custom">
      <div class="card-body">
        <h5 class="card-title">{{ item.titulo }}</h5>
        <p class="card-text">{{ item.descripcion }}</p>
      </div>
    </div>
  </div>
  {% endfor %}
</div>
```

### Formulario Dos Columnas

```html
<div class="card card-custom">
  <div class="card-body">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0">Información Personal</h2>
      <button class="btn btn-primary-custom">
        <i class="bi bi-pencil me-2"></i>
        Editar
      </button>
    </div>
    
    <form method="post">
      {% csrf_token %}
      <div class="row g-3">
        <!-- Campo 1 -->
        <div class="col-md-6">
          <label class="form-label form-label-custom">Nombre *</label>
          <input type="text" class="form-control form-control-custom">
        </div>
        
        <!-- Campo 2 -->
        <div class="col-md-6">
          <label class="form-label form-label-custom">Apellido Materno</label>
          <input type="text" class="form-control form-control-custom">
        </div>
        
        <!-- Campo Full Width -->
        <div class="col-12">
          <label class="form-label form-label-custom">Dirección</label>
          <input type="text" class="form-control form-control-custom">
        </div>
      </div>
      
      <!-- Botones -->
      <div class="d-flex gap-2 justify-content-end mt-4">
        <button type="button" class="btn btn-secondary-custom">Cancelar</button>
        <button type="submit" class="btn btn-primary-custom">Guardar</button>
      </div>
    </form>
  </div>
</div>
```

---

## 🎭 Iconografía

### Bootstrap Icons

**Instalación:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
```

**Iconos Principales:**

```html
<i class="bi bi-person"></i>              <!-- Perfil, usuarios -->
<i class="bi bi-briefcase"></i>           <!-- Datos laborales -->
<i class="bi bi-file-text"></i>           <!-- Documentos -->
<i class="bi bi-calendar"></i>            <!-- Fechas -->
<i class="bi bi-bullseye"></i>            <!-- Objetivos, KPIs -->
<i class="bi bi-clipboard-check"></i>     <!-- Evaluaciones -->
<i class="bi bi-clock"></i>               <!-- Tiempo, fichajes -->
<i class="bi bi-check-square"></i>        <!-- Tareas -->
<i class="bi bi-bar-chart"></i>           <!-- Estadísticas -->
<i class="bi bi-gear"></i>                <!-- Configuración -->
<i class="bi bi-shield"></i>              <!-- Seguridad -->
<i class="bi bi-people"></i>              <!-- Grupos -->
<i class="bi bi-mortarboard"></i>         <!-- Formación -->
<i class="bi bi-map"></i>                 <!-- Journey -->
<i class="bi bi-lock"></i>                <!-- Accesos -->
<i class="bi bi-lightning"></i>           <!-- Automatizaciones -->
<i class="bi bi-pencil"></i>              <!-- Editar -->
<i class="bi bi-save"></i>                <!-- Guardar -->
<i class="bi bi-x"></i>                   <!-- Cerrar -->
<i class="bi bi-search"></i>              <!-- Búsqueda -->
<i class="bi bi-arrow-left"></i>          <!-- Volver -->
<i class="bi bi-chevron-down"></i>        <!-- Dropdown -->
```

**Tamaños:**
```html
<i class="bi bi-person"></i>              <!-- 16px - Normal -->
<i class="bi bi-person fs-5"></i>         <!-- 20px - Mediano -->
<i class="bi bi-person fs-4"></i>         <!-- 24px - Grande -->
<i class="bi bi-person fs-2"></i>         <!-- 32px - Extra Grande -->
```

---

## 🚀 Prompt de Implementación Bootstrap

### PROMPT COMPLETO PARA DJANGO + BOOTSTRAP

---

**PROMPT DE DISEÑO - SISTEMA EVALPRO CON BOOTSTRAP 5 + DJANGO**

Implementa un sistema de diseño moderno estilo SaaS profesional usando **Bootstrap 5** y **Django** con estas especificaciones:

**STACK:**
- Django 4.x / 5.x
- Bootstrap 5.3.2
- Bootstrap Icons 1.11
- Google Font: Inter (400, 500, 600, 700)

**CONFIGURACIÓN BASE:**

1. **base.html template:**
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}EvalPro{% endblock %}</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Google Fonts - Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    
    <!-- Custom CSS -->
    <link href="{% static 'css/custom.css' %}" rel="stylesheet">
</head>
<body>
    {% block content %}{% endblock %}
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

2. **static/css/custom.css - Variables CSS:**
```css
:root {
  --bs-gray-50: #f8fafc;
  --bs-gray-100: #f1f5f9;
  --bs-gray-200: #e2e8f0;
  --bs-gray-500: #64748b;
  --bs-gray-700: #334155;
  --bs-gray-900: #0f172a;
  --color-accent-blue: #2563eb;
  --bs-border-radius: 0.75rem;
  --bs-border-radius-xl: 1.25rem;
  --bs-box-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bs-gray-50);
  color: var(--bs-gray-700);
}

/* Clases de utilidad */
.bg-slate-50 { background-color: var(--bs-gray-50) !important; }
.bg-slate-900 { background-color: var(--bs-gray-900) !important; }
.text-slate-500 { color: var(--bs-gray-500) !important; }
.text-slate-700 { color: var(--bs-gray-700) !important; }
.text-slate-900 { color: var(--bs-gray-900) !important; }
.border-slate-200 { border-color: var(--bs-gray-200) !important; }
.rounded-xl { border-radius: var(--bs-border-radius-xl) !important; }
.shadow-lg { box-shadow: var(--bs-box-shadow-lg) !important; }
```

**COMPONENTES:**

1. **Botón Primario:**
```html
<button class="btn btn-primary-custom">
  <i class="bi bi-plus-circle me-2"></i>
  Botón
</button>

<!-- CSS -->
.btn-primary-custom {
  background-color: var(--bs-gray-900);
  border-color: var(--bs-gray-900);
  color: white;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--bs-border-radius);
}
.btn-primary-custom:hover {
  background-color: #1e293b;
  border-color: #1e293b;
}
```

2. **Botón Secundario:**
```html
<button class="btn btn-secondary-custom">Cancelar</button>

<!-- CSS -->
.btn-secondary-custom {
  background-color: white;
  border: 1px solid var(--bs-gray-200);
  color: var(--bs-gray-700);
  padding: 0.5rem 1rem;
  border-radius: var(--bs-border-radius);
}
.btn-secondary-custom:hover {
  background-color: var(--bs-gray-50);
}
```

3. **Input de Formulario:**
```html
<div class="mb-3">
  <label class="form-label form-label-custom">Nombre *</label>
  <input type="text" class="form-control form-control-custom" placeholder="Ingresa tu nombre">
</div>

<!-- CSS -->
.form-control-custom {
  border-color: var(--bs-gray-200);
  border-radius: var(--bs-border-radius);
  padding: 0.5rem 0.75rem;
}
.form-control-custom:focus {
  border-color: var(--bs-gray-900);
  box-shadow: 0 0 0 0.2rem rgba(15, 23, 42, 0.25);
}
.form-label-custom {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--bs-gray-700);
  margin-bottom: 0.5rem;
}
```

4. **Card:**
```html
<div class="card card-custom">
  <div class="card-body">
    <h5 class="card-title">Título</h5>
    <p class="card-text">Contenido</p>
  </div>
</div>

<!-- CSS -->
.card-custom {
  border: 1px solid var(--bs-gray-200);
  border-radius: var(--bs-border-radius-xl);
  box-shadow: var(--bs-box-shadow-lg);
}
```

5. **Tabs Horizontales:**
```html
<ul class="nav nav-tabs nav-tabs-custom">
  <li class="nav-item">
    <a class="nav-link active" href="#perfil">
      <i class="bi bi-person me-2"></i>Perfil
    </a>
  </li>
</ul>

<!-- CSS -->
.nav-tabs-custom {
  border-bottom: 1px solid var(--bs-gray-200);
}
.nav-tabs-custom .nav-link {
  color: var(--bs-gray-600);
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.75rem 0.5rem;
}
.nav-tabs-custom .nav-link.active {
  color: var(--color-accent-blue);
  border-bottom-color: var(--color-accent-blue);
}
```

6. **Avatar Grande:**
```html
<div class="avatar-container text-center">
  <img src="/avatar.jpg" class="avatar-lg">
  <button class="avatar-edit-btn">
    <i class="bi bi-pencil"></i>
  </button>
</div>

<!-- CSS -->
.avatar-lg {
  width: 14rem;
  height: 14rem;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
.avatar-edit-btn {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: var(--bs-gray-900);
}
```

7. **Tabla:**
```html
<div class="table-custom">
  <table class="table table-hover mb-0">
    <thead>
      <tr>
        <th>Columna</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Contenido</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- CSS -->
.table-custom {
  background-color: white;
  border: 1px solid var(--bs-gray-200);
  border-radius: var(--bs-border-radius-xl);
  overflow: hidden;
}
.table-custom thead {
  background-color: var(--bs-gray-50);
}
```

**LAYOUTS:**

1. **Container Responsivo:**
```html
<div class="container-fluid px-4 py-4">
  Contenido
</div>
```

2. **Sidebar + Main:**
```html
<div class="row g-4">
  <aside class="col-lg-3">Sidebar</aside>
  <main class="col-lg-9">Main</main>
</div>
```

3. **Grid de Cards:**
```html
<div class="row g-4">
  <div class="col-12 col-md-6 col-lg-4">
    <!-- Card -->
  </div>
</div>
```

**REGLAS DE DISEÑO:**
- Bordes redondeados: `.rounded-xl` para cards
- Espaciado: Bootstrap spacing utilities (mb-3, gap-3, p-4)
- Sombras: Custom class `.shadow-lg`
- Transiciones: `transition: all 0.2s ease`
- Iconos: Bootstrap Icons con tamaños `.fs-*`

Implementa este diseño manteniendo consistencia con Bootstrap 5 y Django templates.

---

## 📦 Checklist de Implementación Django

- [ ] Instalar Bootstrap 5 (CDN o NPM)
- [ ] Instalar Bootstrap Icons
- [ ] Agregar fuente Inter en base.html
- [ ] Crear archivo custom.css con variables CSS
- [ ] Crear clases de utilidad personalizadas
- [ ] Implementar componentes base (botones, inputs, cards)
- [ ] Configurar STATIC_URL en settings.py
- [ ] Crear templates base.html
- [ ] Implementar layouts principales
- [ ] Probar responsividad en diferentes dispositivos

---

**Versión:** 1.0 Bootstrap  
**Fecha:** Abril 2026  
**Proyecto:** EvalPro - Sistema de Evaluación (Bootstrap + Django)
