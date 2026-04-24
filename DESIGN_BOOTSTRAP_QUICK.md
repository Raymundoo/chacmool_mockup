# 🚀 PROMPT RÁPIDO - BOOTSTRAP 5 + DJANGO

Copia y pega este prompt para implementar el diseño EvalPro con Bootstrap 5 y Django:

---

## PROMPT COMPLETO

Implementa un sistema de diseño moderno SaaS profesional usando **Bootstrap 5.3.2 + Django** con estas especificaciones exactas:

**SETUP INICIAL:**

```html
<!-- templates/base.html -->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}App{% endblock %}</title>
    
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Inter Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    
    <!-- Custom CSS -->
    <link href="{% static 'css/custom.css' %}" rel="stylesheet">
</head>
<body class="bg-slate-50">
    {% block content %}{% endblock %}
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

**CUSTOM CSS (static/css/custom.css):**

```css
:root {
  /* Colores */
  --bs-gray-50: #f8fafc;
  --bs-gray-100: #f1f5f9;
  --bs-gray-200: #e2e8f0;
  --bs-gray-400: #94a3b8;
  --bs-gray-500: #64748b;
  --bs-gray-600: #475569;
  --bs-gray-700: #334155;
  --bs-gray-800: #1e293b;
  --bs-gray-900: #0f172a;
  --color-blue: #2563eb;
  --color-purple: #9333ea;
  --color-teal: #14b8a6;
  --color-orange: #fb923c;
  
  /* Otros */
  --bs-border-radius: 0.75rem;
  --bs-border-radius-xl: 1.25rem;
  --bs-box-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

body {
  font-family: 'Inter', -apple-system, sans-serif;
  background-color: var(--bs-gray-50);
  color: var(--bs-gray-700);
}

/* Utilities */
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

/* Botones */
.btn-primary-custom {
  background-color: var(--bs-gray-900);
  border-color: var(--bs-gray-900);
  color: white;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--bs-border-radius);
  transition: all 0.2s;
}
.btn-primary-custom:hover {
  background-color: var(--bs-gray-800);
  border-color: var(--bs-gray-800);
  color: white;
}

.btn-secondary-custom {
  background-color: white;
  border: 1px solid var(--bs-gray-200);
  color: var(--bs-gray-700);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--bs-border-radius);
  transition: all 0.2s;
}
.btn-secondary-custom:hover {
  background-color: var(--bs-gray-50);
  border-color: var(--bs-gray-200);
  color: var(--bs-gray-700);
}

/* Formularios */
.form-control-custom {
  border-color: var(--bs-gray-200);
  border-radius: var(--bs-border-radius);
  padding: 0.5rem 0.75rem;
  color: var(--bs-gray-900);
  transition: border-color 0.2s;
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

/* Cards */
.card-custom {
  background-color: white;
  border: 1px solid var(--bs-gray-200);
  border-radius: var(--bs-border-radius-xl);
  box-shadow: var(--bs-box-shadow-lg);
  transition: box-shadow 0.3s;
}
.card-custom:hover {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
.card-custom .card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--bs-gray-900);
}
.card-custom .card-text {
  font-size: 0.875rem;
  color: var(--bs-gray-500);
}

/* Tabs */
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
  margin-right: 1rem;
  transition: all 0.2s;
}
.nav-tabs-custom .nav-link:hover {
  color: var(--bs-gray-900);
}
.nav-tabs-custom .nav-link.active {
  color: var(--color-blue);
  border-bottom-color: var(--color-blue);
  background-color: transparent;
}

/* Sidebar Nav */
.nav-sidebar .nav-link {
  color: var(--bs-gray-600);
  font-size: 0.875rem;
  padding: 0.625rem 0.75rem;
  border-radius: var(--bs-border-radius);
  transition: all 0.2s;
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

/* Avatares */
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
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
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
  transition: background-color 0.2s;
}
.avatar-edit-btn:hover {
  background-color: var(--bs-gray-800);
}

/* Tablas */
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
  transition: background-color 0.2s;
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

/* Badges */
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
```

---

## EJEMPLOS DE COMPONENTES:

**1. Botón Primario:**
```html
<button class="btn btn-primary-custom">
  <i class="bi bi-plus-circle me-2"></i>
  Nuevo
</button>
```

**2. Botón Secundario:**
```html
<button class="btn btn-secondary-custom">Cancelar</button>
```

**3. Input de Formulario:**
```html
<div class="mb-3">
  <label for="nombre" class="form-label form-label-custom">Nombre *</label>
  <input type="text" class="form-control form-control-custom" id="nombre" placeholder="Tu nombre">
</div>
```

**4. Select:**
```html
<div class="mb-3">
  <label for="estado" class="form-label form-label-custom">Estado Civil</label>
  <select class="form-select form-control-custom" id="estado">
    <option value="">Selecciona una opción</option>
    <option value="soltero">Soltero/a</option>
    <option value="casado">Casado/a</option>
  </select>
</div>
```

**5. Checkbox:**
```html
<div class="mb-3 form-check">
  <input type="checkbox" class="form-check-input" id="compartir">
  <label class="form-check-label text-slate-500" for="compartir">
    Compartir cumpleaños
  </label>
</div>
```

**6. Card:**
```html
<div class="card card-custom">
  <div class="card-body">
    <h5 class="card-title">Título del Card</h5>
    <p class="card-text">Descripción o contenido del card.</p>
    <button class="btn btn-primary-custom">Acción</button>
  </div>
</div>
```

**7. Tabs Horizontales:**
```html
<ul class="nav nav-tabs nav-tabs-custom mb-4">
  <li class="nav-item">
    <a class="nav-link active" href="#perfil">
      <i class="bi bi-person me-2"></i>Perfil
    </a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#fichajes">
      <i class="bi bi-clock me-2"></i>Fichajes
    </a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#evaluaciones">
      <i class="bi bi-clipboard-check me-2"></i>Evaluaciones
    </a>
  </li>
</ul>
```

**8. Sidebar Navigation:**
```html
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
    <li class="nav-item">
      <a class="nav-link" href="#datos-nomina">
        <i class="bi bi-file-text"></i>
        Datos nómina
      </a>
    </li>
  </ul>
</div>
```

**9. Avatar con Botón de Edición:**
```html
<div class="text-center mb-4">
  <div class="avatar-container">
    <img src="{{ user.avatar_url }}" alt="{{ user.name }}" class="avatar-lg">
    <button class="avatar-edit-btn">
      <i class="bi bi-pencil"></i>
    </button>
  </div>
  <h3 class="fw-semibold text-slate-900 mt-3 mb-1">{{ user.name }}</h3>
  <p class="text-slate-500">{{ user.position }}</p>
</div>
```

**10. Tabla:**
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
      {% for emp in empleados %}
      <tr>
        <td>
          <div class="d-flex align-items-center gap-3">
            <img src="{{ emp.avatar }}" class="avatar-sm">
            <div>
              <div class="fw-medium text-slate-900">{{ emp.nombre }}</div>
              <div class="text-slate-500 small">{{ emp.cargo }}</div>
            </div>
          </div>
        </td>
        <td class="text-center fw-semibold" style="color: var(--color-purple);">{{ emp.valores }}%</td>
        <td class="text-center fw-semibold" style="color: var(--color-blue);">{{ emp.resultados }}%</td>
        <td class="text-center">
          <span class="badge badge-custom badge-blue">{{ emp.clasificacion }}</span>
        </td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>
```

**11. Empty State:**
```html
<div class="text-center py-5">
  <div class="d-inline-flex align-items-center justify-content-center bg-slate-100 rounded-circle mb-3" 
       style="width: 4rem; height: 4rem;">
    <i class="bi bi-inbox fs-2 text-slate-400"></i>
  </div>
  <h3 class="h5 fw-semibold text-slate-900 mb-2">No hay datos disponibles</h3>
  <p class="text-slate-500">Aquí aparecerán los datos cuando estén disponibles</p>
</div>
```

---

## LAYOUTS:

**1. Layout Principal (Header + Content):**
```html
{% extends 'base.html' %}

{% block content %}
<div class="min-vh-100 bg-slate-50">
  <!-- Header -->
  <div class="bg-white border-bottom border-slate-200">
    <div class="container-fluid px-4 py-3">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
          <img src="{% static 'img/logo.png' %}" style="width: 3rem; height: 3rem;">
          <h1 class="h5 mb-0 fw-semibold text-slate-900">Título</h1>
        </div>
        <div class="d-flex align-items-center gap-3">
          <button class="btn btn-primary-custom">Acción</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Main Content -->
  <div class="container-fluid px-4 py-4">
    <!-- Contenido aquí -->
  </div>
</div>
{% endblock %}
```

**2. Sidebar + Main:**
```html
<div class="container-fluid px-4 py-4">
  <div class="row g-4">
    <!-- Sidebar -->
    <aside class="col-lg-3 col-xl-2">
      <div class="card card-custom p-3">
        <ul class="nav nav-sidebar flex-column">
          <li class="nav-item">
            <a class="nav-link active" href="#">
              <i class="bi bi-person"></i>
              Opción 1
            </a>
          </li>
        </ul>
      </div>
    </aside>
    
    <!-- Main -->
    <main class="col-lg-9 col-xl-10">
      <div class="card card-custom">
        <div class="card-body">
          <!-- Contenido principal -->
        </div>
      </div>
    </main>
  </div>
</div>
```

**3. Grid de Cards:**
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

**4. Formulario 2 Columnas:**
```html
<div class="card card-custom">
  <div class="card-body">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0">Información Personal</h2>
      <button class="btn btn-primary-custom">
        <i class="bi bi-pencil me-2"></i>Editar
      </button>
    </div>
    
    <form method="post">
      {% csrf_token %}
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label form-label-custom">Nombre *</label>
          <input type="text" class="form-control form-control-custom" name="nombre">
        </div>
        
        <div class="col-md-6">
          <label class="form-label form-label-custom">Apellido Materno</label>
          <input type="text" class="form-control form-control-custom" name="apellido_materno">
        </div>
        
        <div class="col-12">
          <label class="form-label form-label-custom">Dirección</label>
          <input type="text" class="form-control form-control-custom" name="direccion">
        </div>
      </div>
      
      <div class="d-flex gap-2 justify-content-end mt-4">
        <button type="button" class="btn btn-secondary-custom">Cancelar</button>
        <button type="submit" class="btn btn-primary-custom">
          <i class="bi bi-save me-2"></i>Guardar
        </button>
      </div>
    </form>
  </div>
</div>
```

---

## ICONOS PRINCIPALES (Bootstrap Icons):

```html
<i class="bi bi-person"></i>              <!-- Perfil -->
<i class="bi bi-briefcase"></i>           <!-- Trabajo -->
<i class="bi bi-file-text"></i>           <!-- Documentos -->
<i class="bi bi-calendar"></i>            <!-- Fechas -->
<i class="bi bi-bullseye"></i>            <!-- Objetivos -->
<i class="bi bi-clipboard-check"></i>     <!-- Evaluaciones -->
<i class="bi bi-clock"></i>               <!-- Tiempo -->
<i class="bi bi-check-square"></i>        <!-- Tareas -->
<i class="bi bi-bar-chart"></i>           <!-- Estadísticas -->
<i class="bi bi-gear"></i>                <!-- Configuración -->
<i class="bi bi-pencil"></i>              <!-- Editar -->
<i class="bi bi-save"></i>                <!-- Guardar -->
<i class="bi bi-x"></i>                   <!-- Cerrar -->
<i class="bi bi-search"></i>              <!-- Buscar -->
<i class="bi bi-plus-circle"></i>         <!-- Agregar -->
```

**Tamaños de iconos:**
- Normal: `<i class="bi bi-person"></i>` (16px)
- Mediano: `<i class="bi bi-person fs-5"></i>` (20px)
- Grande: `<i class="bi bi-person fs-4"></i>` (24px)
- Extra Grande: `<i class="bi bi-person fs-2"></i>` (32px)

---

## REGLAS DE DISEÑO:

1. **Colores:** Usar variables CSS definidas (`--bs-gray-900`, `--color-blue`, etc.)
2. **Bordes redondeados:** `.rounded-xl` para cards grandes, `.rounded` para elementos pequeños
3. **Espaciado:** Bootstrap spacing (`mb-3`, `gap-3`, `p-4`)
4. **Tipografía:** Títulos con `.fw-semibold`, cuerpo con `.text-slate-700`
5. **Transiciones:** Agregar `transition: all 0.2s` en hover states
6. **Sombras:** Usar `.shadow-lg` para cards destacados
7. **Forms:** Siempre usar `.form-label-custom` y `.form-control-custom`
8. **Botones:** Usar `.btn-primary-custom` o `.btn-secondary-custom`
9. **Responsive:** Usar grid de Bootstrap (`col-12 col-md-6 col-lg-4`)

---

## CONFIGURACIÓN DJANGO:

**settings.py:**
```python
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'
```

**Estructura de archivos:**
```
proyecto/
├── templates/
│   ├── base.html
│   └── pages/
│       └── perfil.html
├── static/
│   └── css/
│       └── custom.css
└── manage.py
```

---

**Este prompt contiene TODO lo necesario para implementar el diseño EvalPro con Bootstrap 5 y Django.**
