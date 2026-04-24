# 🚀 PROMPT DE DISEÑO - QUICK START

Copia y pega este prompt a cualquier agente AI para replicar el diseño de EvalPro:

---

## PROMPT COMPLETO

Implementa un sistema de diseño moderno estilo SaaS profesional con estas especificaciones exactas:

**STACK:**
- React + Tailwind CSS v3
- Lucide React icons
- Google Font: Inter (400, 500, 600, 700)

**COLORES:**
```
Fondos: bg-slate-50 (página), bg-white (cards)
Texto: text-slate-900 (principal), text-slate-700 (labels), text-slate-500 (secundario)
Bordes: border-slate-200
Primario: bg-slate-900 text-white (botones principales)
Acento: blue-600 (links, tabs activos)
Success: teal-500 / Warning: orange-400 / Error: red-500
```

**TIPOGRAFÍA:**
```jsx
H1: className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900"
H2: className="text-xl font-semibold text-slate-900"
H3: className="text-lg font-semibold text-slate-900"
Body: className="text-base text-slate-700"
Secundario: className="text-sm text-slate-500"
Small: className="text-xs text-slate-400"
```

**COMPONENTES BASE:**

1. **Botón Primario:**
```jsx
<button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
  <Icon className="w-4 h-4" />
  Botón
</button>
```

2. **Botón Secundario:**
```jsx
<button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
  Botón
</button>
```

3. **Input:**
```jsx
<div>
  <label className="block text-sm font-medium text-slate-700 mb-2">Label</label>
  <input 
    type="text"
    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
    placeholder="Placeholder"
  />
</div>
```

4. **Card:**
```jsx
<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
  Contenido
</div>
```

5. **Tab Horizontal:**
```jsx
{/* Activo */}
<button className="flex items-center gap-2 px-2 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
  <Icon className="w-4 h-4" />
  Tab Activo
</button>

{/* Inactivo */}
<button className="flex items-center gap-2 px-2 py-3 text-sm font-medium text-slate-600 border-b-2 border-transparent hover:text-slate-900 transition-colors">
  <Icon className="w-4 h-4" />
  Tab
</button>
```

6. **Sidebar Navigation:**
```jsx
<div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1">
  {/* Activo */}
  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-100 text-slate-900 font-medium text-left">
    <Icon className="w-4 h-4" />
    Activo
  </button>
  
  {/* Inactivo */}
  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left">
    <Icon className="w-4 h-4" />
    Item
  </button>
</div>
```

7. **Avatar Grande:**
```jsx
<div className="relative">
  <img 
    src="/avatar.jpg"
    className="w-56 h-56 rounded-full object-cover border-4 border-white shadow-xl"
  />
  <button className="absolute bottom-2 right-2 w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg">
    <Edit2 className="w-5 h-5" />
  </button>
</div>
```

8. **Empty State:**
```jsx
<div className="text-center py-16">
  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
    <Icon className="w-8 h-8 text-slate-400" />
  </div>
  <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay datos</h3>
  <p className="text-sm text-slate-500">Descripción</p>
</div>
```

9. **Tabla:**
```jsx
<div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
  <table className="w-full">
    <thead className="bg-slate-50 border-b border-slate-200">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
          Columna
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
      <tr className="hover:bg-slate-50 transition-colors">
        <td className="px-6 py-4 text-sm text-slate-900">
          Contenido
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

**LAYOUTS:**

1. **Container Responsive:**
```jsx
<div className="container mx-auto px-8 py-6">
  Contenido
</div>
```

2. **Sidebar + Main:**
```jsx
<div className="flex gap-6">
  <aside className="w-64 flex-shrink-0">Sidebar</aside>
  <main className="flex-1">Main</main>
</div>
```

3. **Grid de Cards:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

4. **Formulario 2 Columnas:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Campos */}
  <div className="md:col-span-2">{/* Campo full width */}</div>
</div>
```

**REGLAS DE DISEÑO:**

- **Bordes redondeados:** `rounded-xl` (cards), `rounded-lg` (botones/inputs), `rounded-full` (avatares)
- **Espaciado:** `gap-4` o `gap-6`, padding de cards `p-6`
- **Sombras:** `shadow-lg` (cards), `shadow-xl` (avatares)
- **Transiciones:** Siempre agregar `transition-colors` o `transition-shadow`
- **Focus:** `focus:ring-2 focus:ring-slate-900 focus:border-transparent`
- **Hover:** `hover:bg-slate-800` (botones primarios), `hover:bg-slate-50` (secundarios)
- **Disabled:** `disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed`
- **Iconos:** `w-4 h-4` (pequeños), `w-5 h-5` (medianos), `w-8 h-8` (grandes)

**INSTALACIÓN:**
```bash
yarn add -D tailwindcss postcss autoprefixer
yarn add tailwindcss-animate lucide-react
```

**HTML (agregar fuente):**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

**tailwind.config.js:**
```javascript
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
```

**PRINCIPIOS:**
- Consistencia: Usar siempre los mismos patrones
- Accesibilidad: Focus states claros en todos los elementos interactivos
- Responsive: Mobile-first con breakpoints md, lg
- Performance: Transiciones suaves pero rápidas (200-300ms)
- Claridad: Jerarquía visual clara con contraste de colores

Implementa este diseño en TODOS los componentes manteniendo consistencia absoluta.

---

**ICONOS MÁS USADOS (Lucide React):**
User, Briefcase, FileText, Calendar, Target, ClipboardList, Clock, CheckSquare, BarChart3, Settings, Shield, Users, GraduationCap, Map, Lock, Zap, Edit2, Save, X, Search, ArrowLeft, ChevronDown

---

## EJEMPLO DE PÁGINA COMPLETA:

```jsx
import { User, Edit2, Save, X } from 'lucide-react';

function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-900">Perfil de Usuario</h1>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
              Acción
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 space-y-4">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img 
                  src="/avatar.jpg"
                  className="w-56 h-56 rounded-full object-cover border-4 border-white shadow-xl"
                />
                <button className="absolute bottom-2 right-2 w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg">
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Nombre Usuario</h3>
              <p className="text-sm text-slate-500 mb-4">Cargo</p>
            </div>
            
            {/* Navigation */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-100 text-slate-900 font-medium text-left">
                <User className="w-4 h-4" />
                Datos personales
              </button>
            </div>
          </aside>
          
          {/* Main */}
          <main className="flex-1">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Información personal</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
```

---

**Este prompt contiene TODO lo necesario para replicar el diseño completo del proyecto EvalPro.**
