import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { 
  Users, 
  Target, 
  MessageSquare, 
  User, 
  Grid3X3, 
  ClipboardEdit,
  ChevronRight,
  TrendingUp,
  Award,
  BarChart3,
  LayoutDashboard,
  ListFilter,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Search,
  Building2,
  ChevronDown,
  Check,
  X,
  Copy,
  FileText
} from "lucide-react";

// Mock data for departments
const mockDepartments = [
  { id: "dept-1", name: "Tecnología", color: "#3B82F6" },
  { id: "dept-2", name: "Producto", color: "#8B5CF6" },
  { id: "dept-3", name: "Diseño", color: "#EC4899" },
  { id: "dept-4", name: "Ventas", color: "#10B981" },
  { id: "dept-5", name: "Marketing", color: "#F59E0B" },
  { id: "dept-6", name: "Recursos Humanos", color: "#EF4444" },
];

// Mock data for employees with department relations
const mockEmployees = [
  { 
    id: "EMP-001", 
    name: "María García López", 
    position: "Senior Developer", 
    departmentId: "dept-1",
    department: "Tecnología",
    hireDate: "2021-03-15",
    supervisor: "Carlos Mendoza",
    supervisorId: "EMP-004",
    email: "maria.garcia@empresa.com",
    phone: "+52 555 123 4567",
    avatar: "https://images.unsplash.com/photo-1733231291455-3c4de1c24e20?w=150&h=150&fit=crop&crop=face",
    kpiScore: 72,
    valuesScore: 85
  },
  { 
    id: "EMP-002", 
    name: "Juan Rodríguez Pérez", 
    position: "Product Manager", 
    departmentId: "dept-2",
    department: "Producto",
    hireDate: "2020-08-22",
    supervisor: "Ana Martínez",
    supervisorId: "EMP-005",
    email: "juan.rodriguez@empresa.com",
    phone: "+52 555 987 6543",
    avatar: "https://images.unsplash.com/photo-1633419798503-0b0c628f267c?w=150&h=150&fit=crop&crop=face",
    kpiScore: 85,
    valuesScore: 78
  },
  { 
    id: "EMP-003", 
    name: "Laura Sánchez Ruiz", 
    position: "UX Designer", 
    departmentId: "dept-3",
    department: "Diseño",
    hireDate: "2022-01-10",
    supervisor: "Carlos Mendoza",
    supervisorId: "EMP-004",
    email: "laura.sanchez@empresa.com",
    phone: "+52 555 456 7890",
    avatar: "https://images.unsplash.com/photo-1649532354755-d6e6ba515703?w=150&h=150&fit=crop&crop=face",
    kpiScore: 65,
    valuesScore: 92
  },
  { 
    id: "EMP-004", 
    name: "Carlos Mendoza", 
    position: "Tech Lead", 
    departmentId: "dept-1",
    department: "Tecnología",
    hireDate: "2019-05-01",
    supervisor: "Director General",
    supervisorId: null,
    email: "carlos.mendoza@empresa.com",
    phone: "+52 555 111 2222",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    kpiScore: 88,
    valuesScore: 90
  },
  { 
    id: "EMP-005", 
    name: "Ana Martínez", 
    position: "Head of Product", 
    departmentId: "dept-2",
    department: "Producto",
    hireDate: "2018-11-15",
    supervisor: "Director General",
    supervisorId: null,
    email: "ana.martinez@empresa.com",
    phone: "+52 555 333 4444",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    kpiScore: 45,
    valuesScore: 82
  },
  { 
    id: "EMP-006", 
    name: "Roberto Díaz", 
    position: "Sales Manager", 
    departmentId: "dept-4",
    department: "Ventas",
    hireDate: "2020-02-28",
    supervisor: "Director Comercial",
    supervisorId: null,
    email: "roberto.diaz@empresa.com",
    phone: "+52 555 555 6666",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    kpiScore: 92,
    valuesScore: 55
  },
  { 
    id: "EMP-007", 
    name: "Patricia Luna", 
    position: "Marketing Specialist", 
    departmentId: "dept-5",
    department: "Marketing",
    hireDate: "2021-07-12",
    supervisor: "Director Marketing",
    supervisorId: null,
    email: "patricia.luna@empresa.com",
    phone: "+52 555 777 8888",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    kpiScore: 30,
    valuesScore: 40
  },
  { 
    id: "EMP-008", 
    name: "Fernando Torres", 
    position: "HR Coordinator", 
    departmentId: "dept-6",
    department: "Recursos Humanos",
    hireDate: "2022-04-05",
    supervisor: "Director RRHH",
    supervisorId: null,
    email: "fernando.torres@empresa.com",
    phone: "+52 555 999 0000",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    kpiScore: 58,
    valuesScore: 62
  }
];

// Mock evaluation templates
const mockEvaluationTemplates = [
  {
    id: "eval-1",
    name: "Evaluación Estándar 2024",
    description: "Evaluación trimestral para todos los empleados",
    type: "360",
    isActive: true,
    categories: [
      { 
        id: "cat-1", 
        name: "Comunicación", 
        weight: 30,
        questions: [
          { id: "q1", text: "Claridad en la comunicación", weight: 40 },
          { id: "q2", text: "Escucha activa", weight: 35 },
          { id: "q3", text: "Dar y recibir feedback", weight: 25 }
        ]
      },
      { 
        id: "cat-2", 
        name: "Trabajo en Equipo", 
        weight: 40,
        questions: [
          { id: "q4", text: "Colaboración efectiva", weight: 50 },
          { id: "q5", text: "Apoyo a compañeros", weight: 30 },
          { id: "q6", text: "Resolución de conflictos", weight: 20 }
        ]
      },
      { 
        id: "cat-3", 
        name: "Liderazgo", 
        weight: 30,
        questions: [
          { id: "q7", text: "Motivación del equipo", weight: 40 },
          { id: "q8", text: "Delegación efectiva", weight: 30 },
          { id: "q9", text: "Visión estratégica", weight: 30 }
        ]
      }
    ]
  },
  {
    id: "eval-2",
    name: "KPIs Comerciales Q1 2024",
    description: "Métricas de desempeño para área comercial",
    type: "kpi",
    isActive: true,
    kpis: [
      { id: "kpi-1", name: "Ventas mensuales", weight: 35, target: 100000 },
      { id: "kpi-2", name: "Clientes nuevos", weight: 25, target: 20 },
      { id: "kpi-3", name: "Retención de clientes", weight: 25, target: 95 },
      { id: "kpi-4", name: "NPS Score", weight: 15, target: 80 }
    ]
  },
  {
    id: "eval-3",
    name: "Evaluación Técnica",
    description: "Evaluación para equipos de desarrollo",
    type: "360",
    isActive: false,
    categories: [
      { 
        id: "cat-4", 
        name: "Habilidades Técnicas", 
        weight: 50,
        questions: [
          { id: "q10", text: "Calidad de código", weight: 40 },
          { id: "q11", text: "Resolución de problemas", weight: 35 },
          { id: "q12", text: "Documentación", weight: 25 }
        ]
      },
      { 
        id: "cat-5", 
        name: "Colaboración", 
        weight: 50,
        questions: [
          { id: "q13", text: "Code reviews", weight: 50 },
          { id: "q14", text: "Mentoría", weight: 50 }
        ]
      }
    ]
  }
];

// Classification logic for 9-box matrix
const getClassification = (kpi, values) => {
  if (kpi > 66 && values > 66) return { code: "A", label: "Top Performer", color: "green" };
  if (kpi > 66 && values > 33 && values <= 66) return { code: "B1", label: "Alto Potencial", color: "yellow" };
  if (kpi > 33 && kpi <= 66 && values > 66) return { code: "B2", label: "Futuro Líder", color: "yellow" };
  if (kpi > 33 && kpi <= 66 && values > 33 && values <= 66) return { code: "B3", label: "Performer Sólido", color: "orange-light" };
  if (kpi > 66 && values <= 33) return { code: "B4", label: "Resultados sin Valores", color: "orange" };
  if (kpi <= 33 && values > 66) return { code: "C1", label: "Valores sin Resultados", color: "orange" };
  if (kpi > 33 && kpi <= 66 && values <= 33) return { code: "C2", label: "Bajo Rendimiento", color: "red-light" };
  if (kpi <= 33 && values > 33 && values <= 66) return { code: "C3", label: "Necesita Desarrollo", color: "red-light" };
  if (kpi <= 33 && values <= 33) return { code: "C4", label: "Acción Urgente", color: "red" };
  return { code: "B3", label: "Performer Sólido", color: "orange-light" };
};

// Color mapping for classifications
const classificationColors = {
  green: { bg: "#ECFDF5", border: "#10B981", text: "#047857" },
  yellow: { bg: "#FFFBEB", border: "#F59E0B", text: "#B45309" },
  "orange-light": { bg: "#FFF7ED", border: "#FB923C", text: "#C2410C" },
  orange: { bg: "#FFEDD5", border: "#F97316", text: "#C2410C" },
  "red-light": { bg: "#FEF2F2", border: "#F87171", text: "#B91C1C" },
  red: { bg: "#FEE2E2", border: "#EF4444", text: "#991B1B" }
};

// Sidebar Navigation Component
const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard General", description: "Vista general" },
    { path: "/employees", icon: Users, label: "Listado Empleados", description: "Gestión de personal" },
    { path: "/evaluations", icon: FileText, label: "Evaluaciones", description: "Plantillas y config" },
    { path: "/entry", icon: ClipboardEdit, label: "Ingreso Resultados", description: "Captura manual" },
    { path: "/profile", icon: User, label: "Perfil Empleado", description: "Información personal" },
    { path: "/360", icon: MessageSquare, label: "Evaluación 360", description: "Habilidades blandas" },
    { path: "/kpi", icon: Target, label: "Evaluación KPI", description: "Resultados cuantitativos" },
    { path: "/self", icon: Award, label: "Autoevaluación", description: "Evaluación propia" },
    { path: "/matrix", icon: Grid3X3, label: "Matriz 9-Box", description: "Clasificación visual" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col" data-testid="sidebar">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Outfit' }}>EvalPro</h1>
            <p className="text-xs text-slate-500">Sistema de Evaluación</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-3 px-3">Vistas</p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive 
                      ? "bg-slate-100 text-slate-900 font-medium" 
                      : "text-slate-600 hover:text-slate-900"
                  }`
                }
                data-testid={`nav-${item.path.replace("/", "") || "home"}`}
              >
                <item.icon className="w-5 h-5" />
                <div className="flex-1">
                  <span className="block">{item.label}</span>
                  <span className="text-xs text-slate-400">{item.description}</span>
                </div>
                {location.pathname === item.path && (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-600 mb-1">Modo Mockup</p>
          <p className="text-xs text-slate-400">Vista previa del diseño</p>
        </div>
      </div>
    </aside>
  );
};

// Dashboard General View (NEW)
const DashboardGeneral = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  
  const filteredEmployees = selectedDepartment === "all" 
    ? mockEmployees 
    : mockEmployees.filter(e => e.departmentId === selectedDepartment);

  // Count employees by classification
  const classificationCounts = {};
  filteredEmployees.forEach(emp => {
    const classification = getClassification(emp.kpiScore, emp.valuesScore);
    classificationCounts[classification.code] = (classificationCounts[classification.code] || 0) + 1;
  });

  // Matrix cells for dashboard
  const matrixCells = [
    { row: 0, col: 0, code: "C1", label: "Valores sin Resultados", color: "orange" },
    { row: 0, col: 1, code: "B2", label: "Futuro Líder", color: "yellow" },
    { row: 0, col: 2, code: "A", label: "Top Performer", color: "green" },
    { row: 1, col: 0, code: "C3", label: "Necesita Desarrollo", color: "red-light" },
    { row: 1, col: 1, code: "B3", label: "Performer Sólido", color: "orange-light" },
    { row: 1, col: 2, code: "B1", label: "Alto Potencial", color: "yellow" },
    { row: 2, col: 0, code: "C4", label: "Acción Urgente", color: "red" },
    { row: 2, col: 1, code: "C2", label: "Bajo Rendimiento", color: "red-light" },
    { row: 2, col: 2, code: "B4", label: "Resultados sin Valores", color: "orange" },
  ];

  // Stats
  const avgKPI = Math.round(filteredEmployees.reduce((a, e) => a + e.kpiScore, 0) / filteredEmployees.length);
  const avgValues = Math.round(filteredEmployees.reduce((a, e) => a + e.valuesScore, 0) / filteredEmployees.length);
  const topPerformers = filteredEmployees.filter(e => getClassification(e.kpiScore, e.valuesScore).code === "A").length;
  const needsAttention = filteredEmployees.filter(e => ["C3", "C4"].includes(getClassification(e.kpiScore, e.valuesScore).code)).length;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Dashboard General
          </h1>
          <p className="text-slate-500 mt-1">Vista general del equipo</p>
        </div>
        
        {/* Department Filter */}
        <div className="relative">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            data-testid="department-filter"
          >
            <option value="all">Todos los departamentos</option>
            {mockDepartments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6" data-testid="stat-employees">
          <p className="text-sm text-slate-500 mb-1">Total Empleados</p>
          <p className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>{filteredEmployees.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6" data-testid="stat-avg-kpi">
          <p className="text-sm text-slate-500 mb-1">Promedio KPI</p>
          <p className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>{avgKPI}%</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6" data-testid="stat-top">
          <p className="text-sm text-slate-500 mb-1">Top Performers</p>
          <p className="text-3xl font-bold text-green-600" style={{ fontFamily: 'Outfit' }}>{topPerformers}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6" data-testid="stat-attention">
          <p className="text-sm text-slate-500 mb-1">Requieren Atención</p>
          <p className="text-3xl font-bold text-red-600" style={{ fontFamily: 'Outfit' }}>{needsAttention}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 9-Box Matrix with Employee Count */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6" data-testid="dashboard-matrix">
          <h2 className="text-lg font-semibold text-slate-900 mb-6" style={{ fontFamily: 'Outfit' }}>
            Distribución en Matriz 9-Box
          </h2>
          
          <div className="flex">
            <div className="flex flex-col justify-center items-center w-10 mr-4">
              <span 
                className="text-xs font-semibold text-slate-500 tracking-wider"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                VALORES (360)
              </span>
            </div>
            
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-3">
                {matrixCells.map((cell) => {
                  const count = classificationCounts[cell.code] || 0;
                  const colors = classificationColors[cell.color];
                  const employees = filteredEmployees.filter(e => 
                    getClassification(e.kpiScore, e.valuesScore).code === cell.code
                  );
                  
                  return (
                    <div
                      key={`${cell.row}-${cell.col}`}
                      className="rounded-2xl border-2 p-4 text-center transition-all hover:scale-[1.02] cursor-pointer"
                      style={{
                        backgroundColor: colors.bg,
                        borderColor: colors.border,
                        minHeight: '120px'
                      }}
                      data-testid={`dashboard-cell-${cell.code}`}
                    >
                      <span 
                        className="text-2xl font-bold"
                        style={{ color: colors.text, fontFamily: 'Outfit' }}
                      >
                        {cell.code}
                      </span>
                      <p className="text-xs mt-1 mb-2" style={{ color: colors.text }}>{cell.label}</p>
                      <div 
                        className="text-3xl font-bold"
                        style={{ color: colors.text, fontFamily: 'Outfit' }}
                      >
                        {count}
                      </div>
                      <p className="text-xs mt-1" style={{ color: colors.text }}>
                        {count === 1 ? 'empleado' : 'empleados'}
                      </p>
                      
                      {/* Mini avatars */}
                      {employees.length > 0 && (
                        <div className="flex justify-center -space-x-2 mt-2">
                          {employees.slice(0, 3).map((emp, idx) => (
                            <img 
                              key={emp.id}
                              src={emp.avatar}
                              alt={emp.name}
                              className="w-6 h-6 rounded-full border-2 border-white"
                              title={emp.name}
                            />
                          ))}
                          {employees.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-medium text-slate-600">
                              +{employees.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="text-center mt-4">
                <span className="text-xs font-semibold text-slate-500 tracking-wider">
                  RESULTADOS (KPI)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Department Summary */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6" data-testid="department-summary">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Por Departamento
            </h2>
            <div className="space-y-3">
              {mockDepartments.map(dept => {
                const deptEmployees = mockEmployees.filter(e => e.departmentId === dept.id);
                const deptAvgKPI = deptEmployees.length > 0 
                  ? Math.round(deptEmployees.reduce((a, e) => a + e.kpiScore, 0) / deptEmployees.length)
                  : 0;
                
                return (
                  <div key={dept.id} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: dept.color }}
                    />
                    <span className="flex-1 text-sm text-slate-600">{dept.name}</span>
                    <span className="text-sm font-medium text-slate-900">{deptEmployees.length}</span>
                    <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${deptAvgKPI}%`,
                          backgroundColor: dept.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6" data-testid="recent-activity">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Actividad Reciente
            </h2>
            <div className="space-y-3">
              {[
                { action: "Evaluación completada", user: "María García", time: "Hace 2h" },
                { action: "KPI actualizado", user: "Juan Rodríguez", time: "Hace 5h" },
                { action: "Override aplicado", user: "Carlos Mendoza", time: "Ayer" },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5" />
                  <div className="flex-1">
                    <p className="text-slate-900">{activity.action}</p>
                    <p className="text-slate-400">{activity.user} · {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Employee List View (NEW)
const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedClassification, setSelectedClassification] = useState("all");

  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === "all" || emp.departmentId === selectedDepartment;
    const classification = getClassification(emp.kpiScore, emp.valuesScore);
    const matchesClass = selectedClassification === "all" || classification.code === selectedClassification;
    return matchesSearch && matchesDept && matchesClass;
  });

  const allClassifications = ["A", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Listado de Empleados
          </h1>
          <p className="text-slate-500 mt-1">Gestión y filtrado de personal</p>
        </div>
        <button 
          className="bg-slate-900 text-white rounded-xl px-4 py-2.5 font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
          data-testid="add-employee-btn"
        >
          <Plus className="w-4 h-4" />
          Agregar Empleado
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6" data-testid="employee-filters">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, puesto o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              data-testid="search-input"
            />
          </div>
          
          {/* Department Filter */}
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              data-testid="dept-filter"
            >
              <option value="all">Todos los departamentos</option>
              {mockDepartments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Classification Filter */}
          <div className="relative">
            <Grid3X3 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={selectedClassification}
              onChange={(e) => setSelectedClassification(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              data-testid="class-filter"
            >
              <option value="all">Todas las clasificaciones</option>
              {allClassifications.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 mb-4">
        Mostrando {filteredEmployees.length} de {mockEmployees.length} empleados
      </p>

      {/* Employee Table/List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden" data-testid="employee-list">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Empleado</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Departamento</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">KPI</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">360</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Clasificación</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map((emp) => {
              const classification = getClassification(emp.kpiScore, emp.valuesScore);
              const colors = classificationColors[classification.color];
              const dept = mockDepartments.find(d => d.id === emp.departmentId);
              
              return (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors" data-testid={`employee-row-${emp.id}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-slate-900">{emp.name}</p>
                        <p className="text-sm text-slate-500">{emp.position}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: `${dept?.color}15`, color: dept?.color }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dept?.color }} />
                      {emp.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-semibold ${
                      emp.kpiScore > 66 ? 'text-green-600' :
                      emp.kpiScore > 33 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {emp.kpiScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-semibold ${
                      emp.valuesScore > 66 ? 'text-green-600' :
                      emp.valuesScore > 33 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {emp.valuesScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-lg font-bold text-sm"
                      style={{ 
                        backgroundColor: colors.bg, 
                        color: colors.text,
                        border: `1px solid ${colors.border}`
                      }}
                    >
                      {classification.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Ver perfil"
                        data-testid={`view-${emp.id}`}
                      >
                        <User className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Evaluar"
                        data-testid={`evaluate-${emp.id}`}
                      >
                        <ClipboardEdit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Evaluation Templates Management View (NEW)
const EvaluationTemplates = () => {
  const [templates, setTemplates] = useState(mockEvaluationTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingWeights, setEditingWeights] = useState(false);

  const updateWeight = (categoryId, newWeight) => {
    if (!selectedTemplate) return;
    setTemplates(prev => prev.map(t => {
      if (t.id !== selectedTemplate.id) return t;
      if (t.type === '360') {
        return {
          ...t,
          categories: t.categories.map(c => 
            c.id === categoryId ? { ...c, weight: parseInt(newWeight) || 0 } : c
          )
        };
      } else {
        return {
          ...t,
          kpis: t.kpis.map(k => 
            k.id === categoryId ? { ...k, weight: parseInt(newWeight) || 0 } : k
          )
        };
      }
    }));
    setSelectedTemplate(prev => {
      if (prev.type === '360') {
        return {
          ...prev,
          categories: prev.categories.map(c => 
            c.id === categoryId ? { ...c, weight: parseInt(newWeight) || 0 } : c
          )
        };
      } else {
        return {
          ...prev,
          kpis: prev.kpis.map(k => 
            k.id === categoryId ? { ...k, weight: parseInt(newWeight) || 0 } : k
          )
        };
      }
    });
  };

  const updateQuestionWeight = (categoryId, questionId, newWeight) => {
    if (!selectedTemplate || selectedTemplate.type !== '360') return;
    setTemplates(prev => prev.map(t => {
      if (t.id !== selectedTemplate.id) return t;
      return {
        ...t,
        categories: t.categories.map(c => {
          if (c.id !== categoryId) return c;
          return {
            ...c,
            questions: c.questions.map(q =>
              q.id === questionId ? { ...q, weight: parseInt(newWeight) || 0 } : q
            )
          };
        })
      };
    }));
    setSelectedTemplate(prev => ({
      ...prev,
      categories: prev.categories.map(c => {
        if (c.id !== categoryId) return c;
        return {
          ...c,
          questions: c.questions.map(q =>
            q.id === questionId ? { ...q, weight: parseInt(newWeight) || 0 } : q
          )
        };
      })
    }));
  };

  const getTotalWeight = () => {
    if (!selectedTemplate) return 0;
    if (selectedTemplate.type === '360') {
      return selectedTemplate.categories.reduce((a, c) => a + c.weight, 0);
    }
    return selectedTemplate.kpis.reduce((a, k) => a + k.weight, 0);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Gestión de Evaluaciones
          </h1>
          <p className="text-slate-500 mt-1">Crea y configura plantillas de evaluación</p>
        </div>
        <button 
          className="bg-slate-900 text-white rounded-xl px-4 py-2.5 font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
          data-testid="create-template-btn"
        >
          <Plus className="w-4 h-4" />
          Nueva Evaluación
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Plantillas Disponibles
          </h2>
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => { setSelectedTemplate(template); setEditingWeights(false); }}
              className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all ${
                selectedTemplate?.id === template.id 
                  ? 'border-slate-900 ring-2 ring-slate-900/10' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              data-testid={`template-${template.id}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {template.type === '360' ? (
                    <MessageSquare className="w-4 h-4 text-purple-500" />
                  ) : (
                    <Target className="w-4 h-4 text-blue-500" />
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    template.type === '360' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {template.type === '360' ? 'Eval 360' : 'KPI'}
                  </span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  template.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {template.isActive ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
              <p className="text-sm text-slate-500">{template.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                <span>
                  {template.type === '360' 
                    ? `${template.categories.length} categorías`
                    : `${template.kpis.length} KPIs`
                  }
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Template Detail */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6" data-testid="template-detail">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Outfit' }}>
                    {selectedTemplate.name}
                  </h2>
                  <p className="text-sm text-slate-500">{selectedTemplate.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingWeights(!editingWeights)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                      editingWeights 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    data-testid="edit-weights-btn"
                  >
                    <Settings className="w-4 h-4" />
                    {editingWeights ? 'Guardando...' : 'Editar Pesos'}
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Weight indicator */}
              <div className={`mb-6 p-4 rounded-xl ${
                getTotalWeight() === 100 ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    getTotalWeight() === 100 ? 'text-green-700' : 'text-amber-700'
                  }`}>
                    Peso total: {getTotalWeight()}%
                  </span>
                  {getTotalWeight() !== 100 && (
                    <span className="text-xs text-amber-600">
                      Debe sumar 100%
                    </span>
                  )}
                </div>
                <div className="h-2 bg-white rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      getTotalWeight() === 100 ? 'bg-green-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(getTotalWeight(), 100)}%` }}
                  />
                </div>
              </div>

              {/* Categories/KPIs */}
              <div className="space-y-4">
                {selectedTemplate.type === '360' ? (
                  selectedTemplate.categories.map((category) => (
                    <div key={category.id} className="border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-slate-900">{category.name}</h3>
                        <div className="flex items-center gap-2">
                          {editingWeights ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={category.weight}
                              onChange={(e) => updateWeight(category.id, e.target.value)}
                              className="w-16 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold"
                              data-testid={`weight-input-${category.id}`}
                            />
                          ) : (
                            <span className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>
                              {category.weight}%
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Questions */}
                      <div className="space-y-2 pl-4 border-l-2 border-slate-100">
                        {category.questions.map((q) => (
                          <div key={q.id} className="flex items-center justify-between py-1">
                            <span className="text-sm text-slate-600">{q.text}</span>
                            {editingWeights ? (
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={q.weight}
                                onChange={(e) => updateQuestionWeight(category.id, q.id, e.target.value)}
                                className="w-14 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded text-xs"
                                data-testid={`q-weight-${q.id}`}
                              />
                            ) : (
                              <span className="text-xs font-medium text-slate-400">{q.weight}%</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  selectedTemplate.kpis.map((kpi) => (
                    <div key={kpi.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                      <div>
                        <h3 className="font-medium text-slate-900">{kpi.name}</h3>
                        <p className="text-sm text-slate-500">Meta: {kpi.target.toLocaleString()}</p>
                      </div>
                      {editingWeights ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={kpi.weight}
                          onChange={(e) => updateWeight(kpi.id, e.target.value)}
                          className="w-16 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold"
                          data-testid={`kpi-weight-${kpi.id}`}
                        />
                      ) : (
                        <span className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>
                          {kpi.weight}%
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Selecciona una plantilla para ver y editar sus detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 9-Box Matrix Component
const NineBoxGrid = ({ kpiScore, valuesScore, compact = false }) => {
  const classification = getClassification(kpiScore, valuesScore);
  
  const matrixCells = [
    { row: 0, col: 0, code: "C1", label: "Valores sin Resultados", color: "orange" },
    { row: 0, col: 1, code: "B2", label: "Futuro Líder", color: "yellow" },
    { row: 0, col: 2, code: "A", label: "Top Performer", color: "green" },
    { row: 1, col: 0, code: "C3", label: "Necesita Desarrollo", color: "red-light" },
    { row: 1, col: 1, code: "B3", label: "Performer Sólido", color: "orange-light" },
    { row: 1, col: 2, code: "B1", label: "Alto Potencial", color: "yellow" },
    { row: 2, col: 0, code: "C4", label: "Acción Urgente", color: "red" },
    { row: 2, col: 1, code: "C2", label: "Bajo Rendimiento", color: "red-light" },
    { row: 2, col: 2, code: "B4", label: "Resultados sin Valores", color: "orange" },
  ];

  return (
    <div className={compact ? "" : "p-4"} data-testid="nine-box-grid">
      <div className="flex">
        <div className={`flex flex-col justify-center items-center ${compact ? 'w-6' : 'w-8'} mr-2`}>
          <span 
            className="text-xs font-semibold text-slate-500 tracking-wider"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            VALORES (360)
          </span>
        </div>
        
        <div className="flex-1">
          <div className={`grid grid-cols-3 ${compact ? 'gap-1' : 'gap-2'} aspect-square`}>
            {matrixCells.map((cell) => {
              const isActive = cell.code === classification.code;
              const colors = classificationColors[cell.color];
              
              return (
                <div
                  key={`${cell.row}-${cell.col}`}
                  className={`matrix-cell rounded-xl border-2 flex flex-col items-center justify-center text-center ${compact ? 'p-1' : 'p-2'} ${isActive ? 'active' : ''}`}
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: isActive ? colors.text : colors.border,
                    boxShadow: isActive ? `0 0 0 3px ${colors.border}40` : 'none'
                  }}
                  data-testid={`matrix-cell-${cell.code}`}
                >
                  <span 
                    className={`font-bold ${compact ? 'text-sm' : 'text-lg'}`}
                    style={{ color: colors.text, fontFamily: 'Outfit' }}
                  >
                    {cell.code}
                  </span>
                  {!compact && (
                    <span className="text-xs mt-1" style={{ color: colors.text }}>
                      {cell.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className={`text-center ${compact ? 'mt-2' : 'mt-3'}`}>
            <span className="text-xs font-semibold text-slate-500 tracking-wider">
              RESULTADOS (KPI)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Slider Component
const ScoreSlider = ({ label, value, onChange, min = 0, max = 100, testId }) => {
  const getTrackColor = (val) => {
    if (val > 66) return "#10B981";
    if (val > 33) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="mb-6" data-testid={testId}>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span 
          className="text-lg font-bold px-3 py-1 rounded-lg"
          style={{ 
            backgroundColor: `${getTrackColor(value)}15`,
            color: getTrackColor(value),
            fontFamily: 'Outfit'
          }}
        >
          {value}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${getTrackColor(value)} 0%, ${getTrackColor(value)} ${value}%, #E2E8F0 ${value}%, #E2E8F0 100%)`
          }}
          data-testid={`${testId}-input`}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-slate-400">{min}</span>
        <span className="text-xs text-slate-400">{max}</span>
      </div>
    </div>
  );
};

// Manual Results Entry View (UPDATED with evaluation selection)
const ManualResultsEntry = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(mockEmployees[0]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(mockEvaluationTemplates[0]);
  const [kpiScore, setKpiScore] = useState(72);
  const [valuesScore, setValuesScore] = useState(85);
  const [manualOverride, setManualOverride] = useState(false);
  const [overrideClassification, setOverrideClassification] = useState("");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [showEvalDropdown, setShowEvalDropdown] = useState(false);
  
  const classification = getClassification(kpiScore, valuesScore);
  const colors = classificationColors[classification.color];
  
  const allClassifications = ["A", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"];
  
  const activeEvaluations = mockEvaluationTemplates.filter(e => e.isActive);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
          Ingreso de Resultados
        </h1>
        <p className="text-slate-500 mt-1">Captura manual de KPI y evaluación 360</p>
      </div>

      {/* Selection Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Employee Selection */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4" data-testid="employee-selector">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Empleado</p>
          <div className="relative">
            <button
              onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
              className="w-full flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors text-left"
              data-testid="employee-dropdown-btn"
            >
              <img src={selectedEmployee.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <p className="font-medium text-slate-900">{selectedEmployee.name}</p>
                <p className="text-sm text-slate-500">{selectedEmployee.position}</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showEmployeeDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showEmployeeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
                {mockEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => { setSelectedEmployee(emp); setShowEmployeeDropdown(false); }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 text-left"
                    data-testid={`emp-option-${emp.id}`}
                  >
                    <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">{emp.name}</p>
                      <p className="text-xs text-slate-500">{emp.department}</p>
                    </div>
                    {selectedEmployee.id === emp.id && <Check className="w-4 h-4 text-green-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Evaluation Selection */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4" data-testid="evaluation-selector">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Evaluación a Aplicar</p>
          <div className="relative">
            <button
              onClick={() => setShowEvalDropdown(!showEvalDropdown)}
              className="w-full flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors text-left"
              data-testid="eval-dropdown-btn"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedEvaluation.type === '360' ? 'bg-purple-100' : 'bg-blue-100'
              }`}>
                {selectedEvaluation.type === '360' ? (
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                ) : (
                  <Target className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{selectedEvaluation.name}</p>
                <p className="text-sm text-slate-500">{selectedEvaluation.type === '360' ? 'Evaluación 360' : 'KPI'}</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showEvalDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showEvalDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-10">
                {activeEvaluations.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => { setSelectedEvaluation(ev); setShowEvalDropdown(false); }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 text-left"
                    data-testid={`eval-option-${ev.id}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      ev.type === '360' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      {ev.type === '360' ? (
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                      ) : (
                        <Target className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">{ev.name}</p>
                      <p className="text-xs text-slate-500">{ev.description}</p>
                    </div>
                    {selectedEvaluation.id === ev.id && <Check className="w-4 h-4 text-green-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* KPI Score Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 card-hover" data-testid="kpi-score-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Outfit' }}>
                  Resultado KPI
                </h2>
                <p className="text-sm text-slate-500">Resultados cuantitativos del período</p>
              </div>
            </div>
            <ScoreSlider
              label="Puntuación KPI (0-100)"
              value={kpiScore}
              onChange={setKpiScore}
              testId="kpi-slider"
            />
            <div className="bg-slate-50 rounded-xl p-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Nivel de desempeño:</span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  kpiScore > 66 ? 'bg-green-100 text-green-700' :
                  kpiScore > 33 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {kpiScore > 66 ? 'Alto' : kpiScore > 33 ? 'Medio' : 'Bajo'}
                </span>
              </div>
            </div>
          </div>

          {/* Values Score Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 card-hover" data-testid="values-score-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Outfit' }}>
                  Evaluación 360
                </h2>
                <p className="text-sm text-slate-500">Valores y habilidades blandas</p>
              </div>
            </div>
            <ScoreSlider
              label="Puntuación 360 (0-100)"
              value={valuesScore}
              onChange={setValuesScore}
              testId="values-slider"
            />
            <div className="bg-slate-50 rounded-xl p-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Nivel de valores:</span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  valuesScore > 66 ? 'bg-green-100 text-green-700' :
                  valuesScore > 33 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {valuesScore > 66 ? 'Alto' : valuesScore > 33 ? 'Medio' : 'Bajo'}
                </span>
              </div>
            </div>
          </div>

          {/* Manual Override */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6" data-testid="manual-override-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                  <ClipboardEdit className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Outfit' }}>
                    Override Manual
                  </h2>
                  <p className="text-sm text-slate-500">Ajuste de clasificación por el líder</p>
                </div>
              </div>
              <button
                onClick={() => setManualOverride(!manualOverride)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  manualOverride ? 'bg-slate-900' : 'bg-slate-200'
                }`}
                data-testid="override-toggle"
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  manualOverride ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>
            
            {manualOverride && (
              <div className="animate-fade-in mt-4">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Seleccionar clasificación manual:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {allClassifications.map((code) => {
                    const cellData = [
                      { code: "A", color: "green" },
                      { code: "B1", color: "yellow" },
                      { code: "B2", color: "yellow" },
                      { code: "B3", color: "orange-light" },
                      { code: "B4", color: "orange" },
                      { code: "C1", color: "orange" },
                      { code: "C2", color: "red-light" },
                      { code: "C3", color: "red-light" },
                      { code: "C4", color: "red" },
                    ].find(c => c.code === code);
                    const cellColors = classificationColors[cellData.color];
                    
                    return (
                      <button
                        key={code}
                        onClick={() => setOverrideClassification(code)}
                        className={`p-3 rounded-xl border-2 font-bold transition-all ${
                          overrideClassification === code ? 'ring-2 ring-slate-900 ring-offset-2' : ''
                        }`}
                        style={{
                          backgroundColor: cellColors.bg,
                          borderColor: cellColors.border,
                          color: cellColors.text
                        }}
                        data-testid={`override-btn-${code}`}
                      >
                        {code}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          {/* Classification Result */}
          <div 
            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 card-hover"
            data-testid="classification-result-card"
          >
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Clasificación Resultante
            </h2>
            <div 
              className="rounded-2xl p-6 text-center mb-4"
              style={{ backgroundColor: colors.bg, border: `2px solid ${colors.border}` }}
            >
              <span 
                className="text-5xl font-bold"
                style={{ color: colors.text, fontFamily: 'Outfit' }}
              >
                {manualOverride && overrideClassification ? overrideClassification : classification.code}
              </span>
              <p className="text-sm mt-2" style={{ color: colors.text }}>
                {manualOverride && overrideClassification 
                  ? `Override: ${overrideClassification}`
                  : classification.label
                }
              </p>
            </div>
            
            {manualOverride && overrideClassification && overrideClassification !== classification.code && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
                <strong>Nota:</strong> La clasificación ha sido modificada manualmente.
                El resultado calculado era <strong>{classification.code}</strong>.
              </div>
            )}
          </div>

          {/* 9-Box Preview */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6" data-testid="nine-box-preview-card">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Vista Previa Matriz 9-Box
            </h2>
            <NineBoxGrid kpiScore={kpiScore} valuesScore={valuesScore} compact />
          </div>

          {/* Employee Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6" data-testid="employee-summary-card">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Resumen del Empleado
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={selectedEmployee.avatar}
                alt={selectedEmployee.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-slate-100"
              />
              <div>
                <p className="font-semibold text-slate-900">{selectedEmployee.name}</p>
                <p className="text-sm text-slate-500">{selectedEmployee.position}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Departamento:</span>
                <span className="text-slate-900">{selectedEmployee.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ID:</span>
                <span className="text-slate-900 font-mono">{selectedEmployee.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Supervisor:</span>
                <span className="text-slate-900">{selectedEmployee.supervisor}</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button 
            className="w-full bg-slate-900 text-white rounded-xl px-6 py-4 font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            data-testid="save-results-btn"
          >
            <TrendingUp className="w-5 h-5" />
            Guardar Resultados
          </button>
        </div>
      </div>
    </div>
  );
};

// Employee Profile View
const EmployeeProfile = () => {
  const employee = mockEmployees[0];
  const classification = getClassification(72, 85);
  const colors = classificationColors[classification.color];

  return (
    <div className="animate-fade-in">
      {/* Cover Banner */}
      <div className="relative h-48 rounded-2xl overflow-hidden mb-6" data-testid="profile-banner">
        <img 
          src="https://images.unsplash.com/photo-1488901512066-cd403111aeb2?w=1200&h=400&fit=crop"
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8 -mt-16 relative z-10 px-6">
        <img 
          src={employee.avatar}
          alt={employee.name}
          className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
          data-testid="profile-avatar"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            {employee.name}
          </h1>
          <p className="text-lg text-slate-500 mt-1">{employee.position}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600">
              {employee.department}
            </span>
            <span 
              className="px-3 py-1 rounded-full text-sm font-semibold"
              style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
            >
              Clasificación: {classification.code}
            </span>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6" data-testid="personal-info-card">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Información Personal
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">ID Empleado</p>
              <p className="font-mono text-slate-900">{employee.id}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Fecha de Ingreso</p>
              <p className="text-slate-900">{new Date(employee.hireDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Supervisor</p>
              <p className="text-slate-900">{employee.supervisor}</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6" data-testid="contact-info-card">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Contacto
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">Email</p>
              <p className="text-slate-900">{employee.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Teléfono</p>
              <p className="text-slate-900">{employee.phone}</p>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6" data-testid="results-summary-card">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Resultados
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">Resultado Calculado</p>
              <span 
                className="inline-flex items-center px-4 py-2 rounded-xl font-bold text-xl"
                style={{ backgroundColor: colors.bg, color: colors.text, border: `2px solid ${colors.border}` }}
              >
                {classification.code}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Resultado Seleccionado (Override)</p>
              <span className="text-slate-900 font-medium">Sin modificación</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 360 Evaluation View
const Evaluation360 = () => {
  const [scores, setScores] = useState({
    comunicacion: { claridad: 4, escucha: 5, feedback: 4 },
    trabajo_equipo: { colaboracion: 5, apoyo: 4, conflictos: 3 },
    liderazgo: { motivacion: 4, delegacion: 3, vision: 4 }
  });

  const calculateCategoryScore = (category) => {
    const values = Object.values(scores[category]);
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 20);
  };

  const totalScore = Math.round(
    (calculateCategoryScore('comunicacion') + 
     calculateCategoryScore('trabajo_equipo') + 
     calculateCategoryScore('liderazgo')) / 3
  );

  const updateScore = (category, item, value) => {
    setScores(prev => ({
      ...prev,
      [category]: { ...prev[category], [item]: value }
    }));
  };

  const categories = [
    { 
      key: 'comunicacion', 
      label: 'Comunicación', 
      icon: MessageSquare,
      items: [
        { key: 'claridad', label: 'Claridad en la comunicación' },
        { key: 'escucha', label: 'Escucha activa' },
        { key: 'feedback', label: 'Dar y recibir feedback' }
      ]
    },
    { 
      key: 'trabajo_equipo', 
      label: 'Trabajo en Equipo', 
      icon: Users,
      items: [
        { key: 'colaboracion', label: 'Colaboración efectiva' },
        { key: 'apoyo', label: 'Apoyo a compañeros' },
        { key: 'conflictos', label: 'Resolución de conflictos' }
      ]
    },
    { 
      key: 'liderazgo', 
      label: 'Liderazgo', 
      icon: Award,
      items: [
        { key: 'motivacion', label: 'Motivación del equipo' },
        { key: 'delegacion', label: 'Delegación efectiva' },
        { key: 'vision', label: 'Visión estratégica' }
      ]
    }
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
          Evaluación 360°
        </h1>
        <p className="text-slate-500 mt-1">Evaluación de valores y habilidades blandas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {categories.map((category, idx) => (
            <div 
              key={category.key}
              className={`bg-white border border-slate-200 rounded-2xl shadow-sm p-6 animate-fade-in stagger-${idx + 1}`}
              data-testid={`category-${category.key}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Outfit' }}>
                    {category.label}
                  </h2>
                </div>
                <span className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>
                  {calculateCategoryScore(category.key)}
                </span>
              </div>

              <div className="space-y-6">
                {category.items.map((item) => (
                  <div key={item.key} data-testid={`item-${category.key}-${item.key}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">{item.label}</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {scores[category.key][item.key]}/5
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          onClick={() => updateScore(category.key, item.key, val)}
                          className={`flex-1 h-10 rounded-lg border-2 transition-all font-medium ${
                            scores[category.key][item.key] >= val
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                          }`}
                          data-testid={`score-${category.key}-${item.key}-${val}`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Score Summary */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sticky top-6" data-testid="total-score-card">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Puntuación Total
            </h2>
            <div className="text-center mb-6">
              <span 
                className="text-6xl font-bold"
                style={{ 
                  fontFamily: 'Outfit',
                  color: totalScore > 66 ? '#10B981' : totalScore > 33 ? '#F59E0B' : '#EF4444'
                }}
              >
                {totalScore}
              </span>
              <p className="text-slate-500 mt-2">de 100 puntos</p>
            </div>

            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat.key} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{cat.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${calculateCategoryScore(cat.key)}%`,
                          backgroundColor: calculateCategoryScore(cat.key) > 66 ? '#10B981' : 
                                          calculateCategoryScore(cat.key) > 33 ? '#F59E0B' : '#EF4444'
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 w-8">
                      {calculateCategoryScore(cat.key)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="w-full mt-6 bg-slate-900 text-white rounded-xl px-6 py-3 font-medium hover:bg-slate-800 transition-colors"
              data-testid="submit-360-btn"
            >
              Enviar Evaluación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// KPI Evaluation View
const KPIEvaluation = () => {
  const [kpis, setKpis] = useState([
    { id: 1, name: "Ventas mensuales", weight: 30, value: 85, target: 100 },
    { id: 2, name: "Satisfacción del cliente", weight: 25, value: 92, target: 100 },
    { id: 3, name: "Proyectos completados", weight: 25, value: 78, target: 100 },
    { id: 4, name: "Tiempo de respuesta", weight: 20, value: 70, target: 100 },
  ]);

  const updateKPI = (id, field, value) => {
    setKpis(prev => prev.map(kpi => 
      kpi.id === id ? { ...kpi, [field]: parseInt(value) || 0 } : kpi
    ));
  };

  const weightedScore = Math.round(
    kpis.reduce((acc, kpi) => acc + (kpi.value * kpi.weight / 100), 0)
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
          Evaluación KPI
        </h1>
        <p className="text-slate-500 mt-1">Resultados cuantitativos del período</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {kpis.map((kpi, idx) => (
            <div 
              key={kpi.id}
              className={`bg-white border border-slate-200 rounded-2xl shadow-sm p-6 animate-fade-in stagger-${idx + 1}`}
              data-testid={`kpi-card-${kpi.id}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{kpi.name}</h3>
                  <p className="text-sm text-slate-500">Peso: {kpi.weight}%</p>
                </div>
                <div className="text-right">
                  <span 
                    className="text-2xl font-bold"
                    style={{ 
                      fontFamily: 'Outfit',
                      color: kpi.value > 66 ? '#10B981' : kpi.value > 33 ? '#F59E0B' : '#EF4444'
                    }}
                  >
                    {kpi.value}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${kpi.value}%`,
                      backgroundColor: kpi.value > 66 ? '#10B981' : kpi.value > 33 ? '#F59E0B' : '#EF4444'
                    }}
                  />
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={kpi.value}
                onChange={(e) => updateKPI(kpi.id, 'value', e.target.value)}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${
                    kpi.value > 66 ? '#10B981' : kpi.value > 33 ? '#F59E0B' : '#EF4444'
                  } 0%, ${
                    kpi.value > 66 ? '#10B981' : kpi.value > 33 ? '#F59E0B' : '#EF4444'
                  } ${kpi.value}%, #E2E8F0 ${kpi.value}%, #E2E8F0 100%)`
                }}
                data-testid={`kpi-slider-${kpi.id}`}
              />

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                <span className="text-sm text-slate-500">Contribución al total:</span>
                <span className="text-sm font-semibold text-slate-900">
                  {Math.round(kpi.value * kpi.weight / 100)} pts
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sticky top-6" data-testid="kpi-summary-card">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Resultado Ponderado
            </h2>
            <div className="text-center mb-6">
              <span 
                className="text-6xl font-bold"
                style={{ 
                  fontFamily: 'Outfit',
                  color: weightedScore > 66 ? '#10B981' : weightedScore > 33 ? '#F59E0B' : '#EF4444'
                }}
              >
                {weightedScore}
              </span>
              <p className="text-slate-500 mt-2">Puntuación KPI Final</p>
            </div>

            <div className="space-y-3 mb-6">
              {kpis.map((kpi) => (
                <div key={kpi.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 truncate flex-1 mr-2">{kpi.name}</span>
                  <span className="font-semibold text-slate-900">{kpi.weight}%</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total pesos:</span>
                <span className="text-sm font-semibold text-slate-900">
                  {kpis.reduce((acc, kpi) => acc + kpi.weight, 0)}%
                </span>
              </div>
            </div>

            <button 
              className="w-full bg-slate-900 text-white rounded-xl px-6 py-3 font-medium hover:bg-slate-800 transition-colors"
              data-testid="save-kpi-btn"
            >
              Guardar KPIs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Self Evaluation View
const SelfEvaluation = () => {
  const [answers, setAnswers] = useState({
    logros: 4,
    desafios: 3,
    crecimiento: 4,
    colaboracion: 5,
    objetivos: 4
  });
  const [useOverride, setUseOverride] = useState(false);
  const [overrideScore, setOverrideScore] = useState(80);

  const questions = [
    { key: 'logros', label: '¿Cómo calificarías tus logros este período?' },
    { key: 'desafios', label: '¿Qué tan bien manejaste los desafíos?' },
    { key: 'crecimiento', label: '¿Cuánto has crecido profesionalmente?' },
    { key: 'colaboracion', label: '¿Cómo fue tu colaboración con el equipo?' },
    { key: 'objetivos', label: '¿Cumpliste con tus objetivos establecidos?' }
  ];

  const calculatedScore = Math.round(
    (Object.values(answers).reduce((a, b) => a + b, 0) / (questions.length * 5)) * 100
  );

  const finalScore = useOverride ? overrideScore : calculatedScore;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
          Autoevaluación
        </h1>
        <p className="text-slate-500 mt-1">Reflexiona sobre tu desempeño</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6" data-testid="self-eval-form">
            <div className="space-y-8">
              {questions.map((q, idx) => (
                <div 
                  key={q.key} 
                  className={`animate-fade-in stagger-${idx + 1}`}
                  data-testid={`question-${q.key}`}
                >
                  <p className="text-slate-900 font-medium mb-3">{q.label}</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => setAnswers(prev => ({ ...prev, [q.key]: val }))}
                        className={`flex-1 h-12 rounded-xl border-2 transition-all font-semibold ${
                          answers[q.key] >= val
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                        }`}
                        data-testid={`answer-${q.key}-${val}`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-slate-400">
                    <span>Bajo</span>
                    <span>Alto</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Score Summary */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sticky top-6" data-testid="self-eval-summary">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Tu Puntuación
            </h2>
            <div className="text-center mb-6">
              <span 
                className="text-6xl font-bold"
                style={{ 
                  fontFamily: 'Outfit',
                  color: finalScore > 66 ? '#10B981' : finalScore > 33 ? '#F59E0B' : '#EF4444'
                }}
              >
                {finalScore}
              </span>
              <p className="text-slate-500 mt-2">
                {useOverride ? 'Puntuación modificada' : 'Puntuación calculada'}
              </p>
            </div>

            {/* Override Section */}
            <div className="border-t border-slate-100 pt-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-700">Modificar puntuación</span>
                <button
                  onClick={() => setUseOverride(!useOverride)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    useOverride ? 'bg-slate-900' : 'bg-slate-200'
                  }`}
                  data-testid="self-override-toggle"
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    useOverride ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>

              {useOverride && (
                <div className="animate-fade-in">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={overrideScore}
                    onChange={(e) => setOverrideScore(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-2xl font-bold focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900"
                    data-testid="override-score-input"
                  />
                  <p className="text-xs text-slate-400 mt-2 text-center">
                    Puntuación calculada: {calculatedScore}
                  </p>
                </div>
              )}
            </div>

            <button 
              className="w-full mt-6 bg-slate-900 text-white rounded-xl px-6 py-3 font-medium hover:bg-slate-800 transition-colors"
              data-testid="submit-self-eval-btn"
            >
              Enviar Autoevaluación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 9-Box Matrix Full View
const NineBoxMatrixView = () => {
  const [selectedCell, setSelectedCell] = useState(null);

  const matrixCells = [
    { row: 0, col: 0, code: "C1", label: "Valores sin Resultados", color: "orange", description: "Alto potencial de valores pero bajo rendimiento. Necesita enfoque en resultados." },
    { row: 0, col: 1, code: "B2", label: "Futuro Líder", color: "yellow", description: "Buen balance con potencial de crecimiento. Candidato a desarrollo de liderazgo." },
    { row: 0, col: 2, code: "A", label: "Top Performer", color: "green", description: "Excelente en resultados y valores. Modelo a seguir, candidato a promoción." },
    { row: 1, col: 0, code: "C3", label: "Necesita Desarrollo", color: "red-light", description: "Rendimiento y valores medios-bajos. Requiere plan de desarrollo integral." },
    { row: 1, col: 1, code: "B3", label: "Performer Sólido", color: "orange-light", description: "Desempeño consistente y confiable. Pilar del equipo." },
    { row: 1, col: 2, code: "B1", label: "Alto Potencial", color: "yellow", description: "Excelentes resultados con valores en desarrollo. Mentoring recomendado." },
    { row: 2, col: 0, code: "C4", label: "Acción Urgente", color: "red", description: "Bajo rendimiento crítico. Requiere intervención inmediata o plan de salida." },
    { row: 2, col: 1, code: "C2", label: "Bajo Rendimiento", color: "red-light", description: "Resultados insuficientes. Necesita plan de mejora con seguimiento cercano." },
    { row: 2, col: 2, code: "B4", label: "Resultados sin Valores", color: "orange", description: "Buenos números pero problemas de cultura. Coaching en soft skills." },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
          Matriz 9-Box
        </h1>
        <p className="text-slate-500 mt-1">Visualización de clasificación de empleados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matrix Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6" data-testid="full-matrix">
            <div className="flex">
              {/* Y-axis label */}
              <div className="flex flex-col justify-center items-center w-12 mr-4">
                <span 
                  className="text-xs font-semibold text-slate-500 tracking-wider"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  VALORES / POTENCIAL (360)
                </span>
              </div>

              <div className="flex-1">
                {/* Y-axis indicators */}
                <div className="flex mb-2">
                  <div className="w-12" />
                  <div className="flex-1 grid grid-cols-3 gap-2 text-center">
                    <span className="text-xs text-slate-400">Bajo (0-33)</span>
                    <span className="text-xs text-slate-400">Medio (34-66)</span>
                    <span className="text-xs text-slate-400">Alto (67-100)</span>
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {matrixCells.map((cell) => {
                    const colors = classificationColors[cell.color];
                    const isSelected = selectedCell?.code === cell.code;
                    
                    return (
                      <button
                        key={`${cell.row}-${cell.col}`}
                        onClick={() => setSelectedCell(cell)}
                        className={`matrix-cell aspect-square rounded-2xl border-2 flex flex-col items-center justify-center text-center p-4 ${isSelected ? 'active' : ''}`}
                        style={{
                          backgroundColor: colors.bg,
                          borderColor: isSelected ? colors.text : colors.border,
                          boxShadow: isSelected ? `0 0 0 3px ${colors.border}40` : 'none'
                        }}
                        data-testid={`matrix-btn-${cell.code}`}
                      >
                        <span 
                          className="text-3xl font-bold"
                          style={{ color: colors.text, fontFamily: 'Outfit' }}
                        >
                          {cell.code}
                        </span>
                        <span className="text-xs mt-2 leading-tight" style={{ color: colors.text }}>
                          {cell.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* X-axis label */}
                <div className="text-center mt-4">
                  <span className="text-xs font-semibold text-slate-500 tracking-wider">
                    RESULTADOS / DESEMPEÑO (KPI)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cell Details */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sticky top-6" data-testid="cell-details">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Detalle de Clasificación
            </h2>
            
            {selectedCell ? (
              <div className="animate-fade-in">
                <div 
                  className="rounded-2xl p-6 text-center mb-4"
                  style={{ 
                    backgroundColor: classificationColors[selectedCell.color].bg,
                    border: `2px solid ${classificationColors[selectedCell.color].border}`
                  }}
                >
                  <span 
                    className="text-5xl font-bold"
                    style={{ color: classificationColors[selectedCell.color].text, fontFamily: 'Outfit' }}
                  >
                    {selectedCell.code}
                  </span>
                  <p 
                    className="text-sm mt-2 font-medium"
                    style={{ color: classificationColors[selectedCell.color].text }}
                  >
                    {selectedCell.label}
                  </p>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Descripción</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {selectedCell.description}
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Rango KPI:</span>
                    <span className="text-slate-900 font-medium">
                      {selectedCell.col === 0 ? '0-33' : selectedCell.col === 1 ? '34-66' : '67-100'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Rango Valores:</span>
                    <span className="text-slate-900 font-medium">
                      {selectedCell.row === 2 ? '0-33' : selectedCell.row === 1 ? '34-66' : '67-100'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Grid3X3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Selecciona una celda para ver detalles</p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6" data-testid="matrix-legend">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Leyenda de Colores
            </h2>
            <div className="space-y-2">
              {[
                { code: "A", color: "green", label: "Top Performer" },
                { code: "B1-B4", color: "yellow", label: "Alto Potencial / Desarrollo" },
                { code: "C1-C2", color: "orange", label: "Atención Requerida" },
                { code: "C3-C4", color: "red", label: "Acción Urgente" },
              ].map((item) => (
                <div key={item.code} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: classificationColors[item.color]?.bg || classificationColors['red-light'].bg }}
                  />
                  <span className="text-sm text-slate-600">
                    <strong>{item.code}:</strong> {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Layout Component
const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// App Component
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardGeneral />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/evaluations" element={<EvaluationTemplates />} />
          <Route path="/entry" element={<ManualResultsEntry />} />
          <Route path="/profile" element={<EmployeeProfile />} />
          <Route path="/360" element={<Evaluation360 />} />
          <Route path="/kpi" element={<KPIEvaluation />} />
          <Route path="/self" element={<SelfEvaluation />} />
          <Route path="/matrix" element={<NineBoxMatrixView />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
