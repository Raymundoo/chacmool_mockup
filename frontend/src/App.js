import { useState, useMemo } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, NavLink, useLocation, useParams, useNavigate } from "react-router-dom";
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
  Plus,
  Trash2,
  Search,
  Building2,
  ChevronDown,
  Check,
  X,
  Copy,
  FileText,
  Link,
  ExternalLink,
  Eye,
  Settings,
  Sliders,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Send,
  BarChart2,
  PieChart,
  Activity,
  Zap,
  Flag,
  Calendar,
  Edit3,
  Share2,
  UserCheck,
  Briefcase,
  Users2,
  Star
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart as RechartsPie, Pie, Cell } from 'recharts';

// ============================================
// MOCK DATA
// ============================================

const mockDepartments = [
  { id: "dept-1", name: "Tecnología", color: "#3B82F6" },
  { id: "dept-2", name: "Producto", color: "#8B5CF6" },
  { id: "dept-3", name: "Diseño", color: "#EC4899" },
  { id: "dept-4", name: "Ventas", color: "#10B981" },
  { id: "dept-5", name: "Marketing", color: "#F59E0B" },
  { id: "dept-6", name: "Recursos Humanos", color: "#EF4444" },
];

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
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    kpiScore: 72,
    valuesScore: 85,
    autoEvalScore: 80,
    leaderEvalScore: 82,
    peerEvalScore: 78,
    manualOverride: null
  },
  { 
    id: "EMP-002", 
    name: "Juan Rodríguez", 
    position: "Product Manager", 
    departmentId: "dept-2",
    department: "Producto",
    hireDate: "2020-08-22",
    supervisor: "Ana Martínez",
    supervisorId: "EMP-005",
    email: "juan.rodriguez@empresa.com",
    phone: "+52 555 987 6543",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    kpiScore: 85,
    valuesScore: 78,
    autoEvalScore: 88,
    leaderEvalScore: 80,
    peerEvalScore: 75,
    manualOverride: null
  },
  { 
    id: "EMP-003", 
    name: "Laura Sánchez", 
    position: "UX Designer", 
    departmentId: "dept-3",
    department: "Diseño",
    hireDate: "2022-01-10",
    supervisor: "Carlos Mendoza",
    supervisorId: "EMP-004",
    email: "laura.sanchez@empresa.com",
    phone: "+52 555 456 7890",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    kpiScore: 65,
    valuesScore: 92,
    autoEvalScore: 85,
    leaderEvalScore: 90,
    peerEvalScore: 88,
    manualOverride: null
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
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    kpiScore: 88,
    valuesScore: 90,
    autoEvalScore: 92,
    leaderEvalScore: 88,
    peerEvalScore: 85,
    manualOverride: null
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
    valuesScore: 82,
    autoEvalScore: 75,
    leaderEvalScore: 70,
    peerEvalScore: 80,
    manualOverride: "B2"
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
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    kpiScore: 92,
    valuesScore: 55,
    autoEvalScore: 70,
    leaderEvalScore: 60,
    peerEvalScore: 50,
    manualOverride: null
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
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    kpiScore: 30,
    valuesScore: 40,
    autoEvalScore: 45,
    leaderEvalScore: 35,
    peerEvalScore: 42,
    manualOverride: null
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
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    kpiScore: 58,
    valuesScore: 62,
    autoEvalScore: 65,
    leaderEvalScore: 60,
    peerEvalScore: 68,
    manualOverride: null
  }
];

// Evaluator types
const evaluatorTypes = [
  { id: "leader", name: "Líder", icon: UserCheck, color: "#3B82F6" },
  { id: "peer", name: "Par/Colega", icon: Users2, color: "#8B5CF6" },
  { id: "client", name: "Cliente", icon: Briefcase, color: "#10B981" },
  { id: "provider", name: "Proveedor", icon: Building2, color: "#F59E0B" },
  { id: "self", name: "Autoevaluación", icon: User, color: "#EC4899" },
];

// Evaluation templates with auto-adjustable weights
const mockEvaluationTemplates = [
  {
    id: "eval-1",
    name: "Evaluación 360 Estándar",
    description: "Evaluación integral de competencias para todos los empleados",
    type: "360",
    isActive: true,
    assignedTo: ["all"],
    categories: [
      { 
        id: "cat-1", 
        name: "Comunicación", 
        weight: 25,
        description: "Habilidad para transmitir ideas de forma clara y efectiva",
        questions: [
          { id: "q1", text: "Expresa sus ideas de manera clara y concisa", weight: 35 },
          { id: "q2", text: "Escucha activamente a los demás", weight: 35 },
          { id: "q3", text: "Proporciona y recibe feedback constructivo", weight: 30 }
        ]
      },
      { 
        id: "cat-2", 
        name: "Trabajo en Equipo", 
        weight: 25,
        description: "Capacidad de colaborar efectivamente con otros",
        questions: [
          { id: "q4", text: "Colabora proactivamente con el equipo", weight: 40 },
          { id: "q5", text: "Apoya a compañeros cuando lo necesitan", weight: 30 },
          { id: "q6", text: "Maneja conflictos de manera constructiva", weight: 30 }
        ]
      },
      { 
        id: "cat-3", 
        name: "Liderazgo", 
        weight: 25,
        description: "Capacidad de guiar e inspirar a otros",
        questions: [
          { id: "q7", text: "Motiva al equipo hacia los objetivos", weight: 35 },
          { id: "q8", text: "Delega tareas de forma efectiva", weight: 35 },
          { id: "q9", text: "Muestra visión estratégica", weight: 30 }
        ]
      },
      { 
        id: "cat-4", 
        name: "Orientación a Resultados", 
        weight: 25,
        description: "Enfoque en cumplir objetivos y metas",
        questions: [
          { id: "q10", text: "Cumple con los plazos establecidos", weight: 35 },
          { id: "q11", text: "Busca la excelencia en su trabajo", weight: 35 },
          { id: "q12", text: "Toma iniciativa para mejorar procesos", weight: 30 }
        ]
      }
    ]
  },
  {
    id: "eval-2",
    name: "KPIs Comerciales Q1",
    description: "Métricas de desempeño para área comercial",
    type: "kpi",
    isActive: true,
    assignedTo: ["dept-4"],
    kpis: [
      { id: "kpi-1", name: "Ventas mensuales", weight: 35, target: 100000, unit: "$", thresholds: { red: 50, yellow: 75, green: 90 } },
      { id: "kpi-2", name: "Clientes nuevos", weight: 25, target: 20, unit: "clientes", thresholds: { red: 40, yellow: 70, green: 90 } },
      { id: "kpi-3", name: "Retención de clientes", weight: 25, target: 95, unit: "%", thresholds: { red: 70, yellow: 85, green: 95 } },
      { id: "kpi-4", name: "NPS Score", weight: 15, target: 80, unit: "pts", thresholds: { red: 50, yellow: 70, green: 85 } }
    ]
  }
];

// Mock evaluation links
const mockEvaluationLinks = [
  { id: "link-1", templateId: "eval-1", employeeId: "EMP-001", evaluatorType: "leader", token: "abc123", status: "pending", createdAt: "2024-01-15", expiresAt: "2024-02-15" },
  { id: "link-2", templateId: "eval-1", employeeId: "EMP-001", evaluatorType: "peer", token: "def456", status: "completed", createdAt: "2024-01-15", expiresAt: "2024-02-15", completedAt: "2024-01-20" },
  { id: "link-3", templateId: "eval-1", employeeId: "EMP-002", evaluatorType: "client", token: "ghi789", status: "pending", createdAt: "2024-01-18", expiresAt: "2024-02-18" },
];

// Mock KPI entries for employees
const mockKPIEntries = [
  { id: "entry-1", employeeId: "EMP-006", kpiId: "kpi-1", value: 85000, target: 100000, status: "approved", period: "2024-Q1", smartGoal: "Incrementar ventas un 15% respecto al trimestre anterior", feedback: "Buen progreso, sigue así" },
  { id: "entry-2", employeeId: "EMP-006", kpiId: "kpi-2", value: 18, target: 20, status: "pending", period: "2024-Q1", smartGoal: "Conseguir 20 clientes nuevos en el trimestre", feedback: null },
  { id: "entry-3", employeeId: "EMP-006", kpiId: "kpi-3", value: 92, target: 95, status: "revision", period: "2024-Q1", smartGoal: "Mantener retención por encima del 95%", feedback: "Revisar estrategia de retención" },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

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

const classificationColors = {
  green: { bg: "#ECFDF5", border: "#10B981", text: "#047857" },
  yellow: { bg: "#FFFBEB", border: "#F59E0B", text: "#B45309" },
  "orange-light": { bg: "#FFF7ED", border: "#FB923C", text: "#C2410C" },
  orange: { bg: "#FFEDD5", border: "#F97316", text: "#C2410C" },
  "red-light": { bg: "#FEF2F2", border: "#F87171", text: "#B91C1C" },
  red: { bg: "#FEE2E2", border: "#EF4444", text: "#991B1B" }
};

const getEmployeeClassification = (emp, evalType = "automatic") => {
  if (emp.manualOverride) {
    const manualColors = {
      "A": "green", "B1": "yellow", "B2": "yellow", "B3": "orange-light",
      "B4": "orange", "C1": "orange", "C2": "red-light", "C3": "red-light", "C4": "red"
    };
    return { code: emp.manualOverride, label: "Manual", color: manualColors[emp.manualOverride] };
  }
  
  let kpi = emp.kpiScore;
  let values = emp.valuesScore;
  
  if (evalType === "auto") {
    values = emp.autoEvalScore || emp.valuesScore;
  } else if (evalType === "leader") {
    values = emp.leaderEvalScore || emp.valuesScore;
  } else if (evalType === "peer") {
    values = emp.peerEvalScore || emp.valuesScore;
  }
  
  return getClassification(kpi, values);
};

// Auto-adjust weights when one changes
const autoAdjustWeights = (items, changedId, newWeight, totalTarget = 100) => {
  const otherItems = items.filter(i => i.id !== changedId);
  const remainingWeight = totalTarget - newWeight;
  const currentOtherTotal = otherItems.reduce((sum, i) => sum + i.weight, 0);
  
  if (currentOtherTotal === 0) {
    const equalWeight = remainingWeight / otherItems.length;
    return items.map(i => i.id === changedId ? { ...i, weight: newWeight } : { ...i, weight: Math.round(equalWeight) });
  }
  
  const ratio = remainingWeight / currentOtherTotal;
  return items.map(i => {
    if (i.id === changedId) return { ...i, weight: newWeight };
    return { ...i, weight: Math.round(i.weight * ratio) };
  });
};

// ============================================
// SIDEBAR COMPONENT
// ============================================

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard", description: "Vista general" },
    { path: "/9box", icon: Grid3X3, label: "Matriz 9-Box", description: "Clasificación visual" },
    { path: "/employees", icon: Users, label: "Empleados", description: "Gestión de personal" },
    { path: "/evaluations", icon: MessageSquare, label: "Evaluaciones 360", description: "Plantillas y enlaces" },
    { path: "/kpis", icon: Target, label: "KPIs", description: "Indicadores clave" },
    { path: "/manual-eval", icon: ClipboardEdit, label: "Evaluación Manual", description: "Asignación directa" },
    { path: "/results", icon: BarChart2, label: "Resultados", description: "Gráficas y reportes" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col" data-testid="sidebar">
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

      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-3 px-3">Menú Principal</p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-600 hover:text-slate-900"
                  }`
                }
                data-testid={`nav-${item.path.replace("/", "") || "home"}`}
              >
                <item.icon className="w-5 h-5" />
                <div className="flex-1">
                  <span className="block">{item.label}</span>
                  <span className="text-xs text-slate-400">{item.description}</span>
                </div>
                {location.pathname === item.path && <ChevronRight className="w-4 h-4 text-slate-400" />}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-xl p-4 text-white">
          <p className="text-xs font-semibold mb-1">Modo Mockup</p>
          <p className="text-xs opacity-70">Vista previa del diseño</p>
        </div>
      </div>
    </aside>
  );
};

// ============================================
// DASHBOARD COMPONENT
// ============================================

const Dashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  
  const filteredEmployees = selectedDepartment === "all" 
    ? mockEmployees 
    : mockEmployees.filter(e => e.departmentId === selectedDepartment);

  const classificationCounts = {};
  filteredEmployees.forEach(emp => {
    const classification = getEmployeeClassification(emp);
    classificationCounts[classification.code] = (classificationCounts[classification.code] || 0) + 1;
  });

  const avgKPI = Math.round(filteredEmployees.reduce((a, e) => a + e.kpiScore, 0) / filteredEmployees.length);
  const avgValues = Math.round(filteredEmployees.reduce((a, e) => a + e.valuesScore, 0) / filteredEmployees.length);
  const topPerformers = filteredEmployees.filter(e => getEmployeeClassification(e).code === "A").length;
  const needsAttention = filteredEmployees.filter(e => ["C3", "C4"].includes(getEmployeeClassification(e).code)).length;
  const pendingEvals = mockEvaluationLinks.filter(l => l.status === "pending").length;

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
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Dashboard General
          </h1>
          <p className="text-slate-500 mt-1">Resumen del estado de evaluaciones</p>
        </div>
        
        <div className="relative">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium cursor-pointer"
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-slate-400" />
            <p className="text-sm text-slate-500">Empleados</p>
          </div>
          <p className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>{filteredEmployees.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-slate-500">Promedio KPI</p>
          </div>
          <p className="text-3xl font-bold text-blue-600" style={{ fontFamily: 'Outfit' }}>{avgKPI}%</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-green-500" />
            <p className="text-sm text-slate-500">Top Performers</p>
          </div>
          <p className="text-3xl font-bold text-green-600" style={{ fontFamily: 'Outfit' }}>{topPerformers}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-slate-500">Requieren Atención</p>
          </div>
          <p className="text-3xl font-bold text-red-600" style={{ fontFamily: 'Outfit' }}>{needsAttention}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <p className="text-sm text-slate-500">Evaluaciones Pendientes</p>
          </div>
          <p className="text-3xl font-bold text-amber-600" style={{ fontFamily: 'Outfit' }}>{pendingEvals}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mini 9-Box */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Outfit' }}>
              Distribución en Matriz 9-Box
            </h2>
            <NavLink to="/9box" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1">
              Ver completo <ChevronRight className="w-4 h-4" />
            </NavLink>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {matrixCells.map((cell) => {
              const count = classificationCounts[cell.code] || 0;
              const colors = classificationColors[cell.color];
              const employees = filteredEmployees.filter(e => getEmployeeClassification(e).code === cell.code);
              
              return (
                <div
                  key={cell.code}
                  className="rounded-xl border-2 p-3 text-center"
                  style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                >
                  <span className="text-lg font-bold" style={{ color: colors.text }}>{cell.code}</span>
                  <p className="text-xs" style={{ color: colors.text }}>{cell.label}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: colors.text }}>{count}</p>
                  {employees.length > 0 && (
                    <div className="flex justify-center -space-x-1 mt-2">
                      {employees.slice(0, 3).map((emp) => (
                        <img key={emp.id} src={emp.avatar} alt="" className="w-5 h-5 rounded-full border border-white" />
                      ))}
                      {employees.length > 3 && (
                        <span className="w-5 h-5 rounded-full bg-slate-200 border border-white flex items-center justify-center text-xs">+{employees.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Acciones Rápidas</h2>
            <div className="space-y-2">
              <NavLink to="/evaluations" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Link className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Generar Enlace</p>
                  <p className="text-xs text-slate-500">Crear evaluación</p>
                </div>
              </NavLink>
              <NavLink to="/kpis" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Revisar KPIs</p>
                  <p className="text-xs text-slate-500">Pendientes de aprobación</p>
                </div>
              </NavLink>
              <NavLink to="/manual-eval" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <ClipboardEdit className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Evaluación Manual</p>
                  <p className="text-xs text-slate-500">Asignar cuadrante</p>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 9-BOX GRID ENHANCED COMPONENT
// ============================================

const NineBoxGridView = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [evalType, setEvalType] = useState("automatic");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();

  const filteredEmployees = selectedDepartment === "all" 
    ? mockEmployees 
    : mockEmployees.filter(e => e.departmentId === selectedDepartment);

  const matrixCells = [
    { row: 0, col: 0, code: "C1", label: "Valores sin Resultados", color: "orange", desc: "Alto en valores pero bajo en resultados. Necesita enfoque en productividad." },
    { row: 0, col: 1, code: "B2", label: "Futuro Líder", color: "yellow", desc: "Buen balance, potencial de liderazgo. Candidato a desarrollo." },
    { row: 0, col: 2, code: "A", label: "Top Performer", color: "green", desc: "Excelente en todo. Modelo a seguir, candidato a promoción." },
    { row: 1, col: 0, code: "C3", label: "Necesita Desarrollo", color: "red-light", desc: "Rendimiento medio-bajo. Requiere plan de mejora integral." },
    { row: 1, col: 1, code: "B3", label: "Performer Sólido", color: "orange-light", desc: "Desempeño consistente y confiable. Pilar del equipo." },
    { row: 1, col: 2, code: "B1", label: "Alto Potencial", color: "yellow", desc: "Excelentes resultados. Mentoring en valores recomendado." },
    { row: 2, col: 0, code: "C4", label: "Acción Urgente", color: "red", desc: "Bajo rendimiento crítico. Intervención inmediata necesaria." },
    { row: 2, col: 1, code: "C2", label: "Bajo Rendimiento", color: "red-light", desc: "Resultados insuficientes. Plan de mejora con seguimiento." },
    { row: 2, col: 2, code: "B4", label: "Resultados sin Valores", color: "orange", desc: "Buenos números pero problemas de cultura. Coaching necesario." },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Matriz 9-Box
          </h1>
          <p className="text-slate-500 mt-1">Visualización y clasificación de empleados</p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm"
            data-testid="dept-filter"
          >
            <option value="all">Todos los departamentos</option>
            {mockDepartments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
          
          <select
            value={evalType}
            onChange={(e) => setEvalType(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm"
            data-testid="eval-type-filter"
          >
            <option value="automatic">Automático (Promedio)</option>
            <option value="auto">Autoevaluación</option>
            <option value="leader">Evaluación Líder</option>
            <option value="peer">Evaluación Pares</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matrix Grid */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex">
            <div className="flex flex-col justify-center items-center w-10 mr-4">
              <span className="text-xs font-semibold text-slate-500 tracking-wider" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                VALORES / POTENCIAL
              </span>
            </div>
            
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-3">
                {matrixCells.map((cell) => {
                  const colors = classificationColors[cell.color];
                  const cellEmployees = filteredEmployees.filter(e => getEmployeeClassification(e, evalType).code === cell.code);
                  
                  return (
                    <div
                      key={cell.code}
                      className={`rounded-2xl border-2 p-4 min-h-[140px] transition-all cursor-pointer hover:scale-[1.02] ${
                        selectedEmployee && getEmployeeClassification(selectedEmployee, evalType).code === cell.code ? 'ring-2 ring-slate-900 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                      data-testid={`cell-${cell.code}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl font-bold" style={{ color: colors.text }}>{cell.code}</span>
                        <span className="text-sm font-semibold px-2 py-0.5 rounded-full bg-white/50" style={{ color: colors.text }}>
                          {cellEmployees.length}
                        </span>
                      </div>
                      <p className="text-xs font-medium mb-3" style={{ color: colors.text }}>{cell.label}</p>
                      
                      {/* Employee names */}
                      <div className="space-y-1">
                        {cellEmployees.slice(0, 4).map((emp) => (
                          <button
                            key={emp.id}
                            onClick={() => setSelectedEmployee(emp)}
                            className={`w-full flex items-center gap-2 p-1.5 rounded-lg transition-all text-left ${
                              selectedEmployee?.id === emp.id ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                            }`}
                          >
                            <img src={emp.avatar} alt="" className="w-6 h-6 rounded-full" />
                            <span className="text-xs font-medium truncate" style={{ color: colors.text }}>
                              {emp.name.split(' ')[0]} {emp.name.split(' ')[1]?.[0]}.
                            </span>
                          </button>
                        ))}
                        {cellEmployees.length > 4 && (
                          <p className="text-xs text-center" style={{ color: colors.text }}>+{cellEmployees.length - 4} más</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="text-center mt-4">
                <span className="text-xs font-semibold text-slate-500 tracking-wider">RESULTADOS / DESEMPEÑO (KPI)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Detail Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Detalle del Empleado
          </h2>
          
          {selectedEmployee ? (
            <div className="animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <img src={selectedEmployee.avatar} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h3 className="font-semibold text-slate-900">{selectedEmployee.name}</h3>
                  <p className="text-sm text-slate-500">{selectedEmployee.position}</p>
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 mt-1">
                    {selectedEmployee.department}
                  </span>
                </div>
              </div>

              {/* Classification */}
              {(() => {
                const classification = getEmployeeClassification(selectedEmployee, evalType);
                const colors = classificationColors[classification.color];
                const cellInfo = matrixCells.find(c => c.code === classification.code);
                return (
                  <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: colors.bg, border: `2px solid ${colors.border}` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold" style={{ color: colors.text }}>{classification.code}</span>
                      <span className="text-sm font-medium" style={{ color: colors.text }}>{classification.label}</span>
                    </div>
                    <p className="text-xs" style={{ color: colors.text }}>{cellInfo?.desc}</p>
                  </div>
                );
              })()}

              {/* Scores */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">KPI</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${selectedEmployee.kpiScore}%` }} />
                    </div>
                    <span className="text-sm font-semibold w-8">{selectedEmployee.kpiScore}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Valores 360</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${selectedEmployee.valuesScore}%` }} />
                    </div>
                    <span className="text-sm font-semibold w-8">{selectedEmployee.valuesScore}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Autoevaluación</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: `${selectedEmployee.autoEvalScore}%` }} />
                    </div>
                    <span className="text-sm font-semibold w-8">{selectedEmployee.autoEvalScore}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => navigate('/results')}
                  className="flex-1 bg-slate-900 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-slate-800"
                >
                  Ver Resultados
                </button>
                <button 
                  onClick={() => navigate('/manual-eval')}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50"
                >
                  Editar
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Selecciona un empleado de la matriz para ver sus detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// EVALUATIONS MANAGEMENT COMPONENT
// ============================================

const EvaluationsView = () => {
  const [templates, setTemplates] = useState(mockEvaluationTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkConfig, setLinkConfig] = useState({ employeeId: '', evaluatorType: 'leader' });
  const [generatedLink, setGeneratedLink] = useState(null);

  const handleWeightChange = (categoryId, newWeight) => {
    if (!selectedTemplate || selectedTemplate.type !== '360') return;
    const newWeight_ = Math.max(0, Math.min(100, parseInt(newWeight) || 0));
    const newCategories = autoAdjustWeights(selectedTemplate.categories, categoryId, newWeight_);
    const updatedTemplate = { ...selectedTemplate, categories: newCategories };
    setSelectedTemplate(updatedTemplate);
    setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
  };

  const handleQuestionWeightChange = (categoryId, questionId, newWeight) => {
    if (!selectedTemplate || selectedTemplate.type !== '360') return;
    const newWeight_ = Math.max(0, Math.min(100, parseInt(newWeight) || 0));
    const updatedTemplate = {
      ...selectedTemplate,
      categories: selectedTemplate.categories.map(cat => {
        if (cat.id !== categoryId) return cat;
        const newQuestions = autoAdjustWeights(cat.questions, questionId, newWeight_);
        return { ...cat, questions: newQuestions };
      })
    };
    setSelectedTemplate(updatedTemplate);
    setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
  };

  const generateLink = () => {
    const token = Math.random().toString(36).substring(2, 10);
    const link = `${window.location.origin}/evaluate/${token}`;
    setGeneratedLink(link);
  };

  const totalWeight = selectedTemplate?.type === '360' 
    ? selectedTemplate.categories.reduce((sum, c) => sum + c.weight, 0) 
    : selectedTemplate?.kpis?.reduce((sum, k) => sum + k.weight, 0) || 0;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Evaluaciones 360
          </h1>
          <p className="text-slate-500 mt-1">Gestiona plantillas y genera enlaces de evaluación</p>
        </div>
        <button 
          className="bg-slate-900 text-white rounded-xl px-4 py-2.5 font-medium hover:bg-slate-800 flex items-center gap-2"
          data-testid="new-template-btn"
        >
          <Plus className="w-4 h-4" />
          Nueva Plantilla
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white">
          <MessageSquare className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="font-semibold mb-1">Evaluación 360°</h3>
          <p className="text-sm opacity-80">Evalúa competencias desde múltiples perspectivas: líder, pares, clientes y autoevaluación.</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
          <Link className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="font-semibold mb-1">Enlaces Públicos</h3>
          <p className="text-sm opacity-80">Genera enlaces únicos para que evaluadores externos completen las evaluaciones sin necesidad de cuenta.</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
          <Sliders className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="font-semibold mb-1">Pesos Automáticos</h3>
          <p className="text-sm opacity-80">Al modificar un peso, los demás se ajustan automáticamente para mantener el 100%.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Plantillas</h2>
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => { setSelectedTemplate(template); setEditMode(false); }}
              className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all ${
                selectedTemplate?.id === template.id ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 hover:border-slate-300'
              }`}
              data-testid={`template-${template.id}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  template.type === '360' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {template.type === '360' ? 'Eval 360' : 'KPI'}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  template.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {template.isActive ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{template.description}</p>
            </div>
          ))}
        </div>

        {/* Template Detail */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{selectedTemplate.name}</h2>
                  <p className="text-sm text-slate-500">{selectedTemplate.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${
                      editMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    data-testid="edit-weights-btn"
                  >
                    <Sliders className="w-4 h-4" />
                    {editMode ? 'Editando Pesos' : 'Editar Pesos'}
                  </button>
                  <button
                    onClick={() => setShowLinkModal(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
                    data-testid="generate-link-btn"
                  >
                    <Link className="w-4 h-4" />
                    Generar Enlace
                  </button>
                </div>
              </div>

              {/* Weight Indicator */}
              <div className={`mb-6 p-4 rounded-xl ${totalWeight === 100 ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${totalWeight === 100 ? 'text-green-700' : 'text-amber-700'}`}>
                    Peso total: {totalWeight}%
                  </span>
                  {totalWeight === 100 ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${totalWeight === 100 ? 'bg-green-500' : 'bg-amber-500'}`}
                    style={{ width: `${Math.min(totalWeight, 100)}%` }}
                  />
                </div>
              </div>

              {/* Categories/KPIs */}
              {selectedTemplate.type === '360' ? (
                <div className="space-y-4">
                  {selectedTemplate.categories.map((category) => (
                    <div key={category.id} className="border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-900">{category.name}</h3>
                          <p className="text-xs text-slate-500">{category.description}</p>
                        </div>
                        {editMode ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={category.weight}
                              onChange={(e) => handleWeightChange(category.id, e.target.value)}
                              className="w-16 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold"
                            />
                            <span className="text-sm text-slate-400">%</span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-slate-900">{category.weight}%</span>
                        )}
                      </div>
                      
                      <div className="space-y-2 mt-3 pl-4 border-l-2 border-slate-100">
                        {category.questions.map((q) => (
                          <div key={q.id} className="flex items-center justify-between py-1">
                            <span className="text-sm text-slate-600 flex-1">{q.text}</span>
                            {editMode ? (
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={q.weight}
                                onChange={(e) => handleQuestionWeightChange(category.id, q.id, e.target.value)}
                                className="w-14 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded text-xs"
                              />
                            ) : (
                              <span className="text-xs font-medium text-slate-400 ml-2">{q.weight}%</span>
                            )}
                          </div>
                        ))}
                        {editMode && (
                          <p className="text-xs text-slate-400 mt-2">
                            Subtotal: {category.questions.reduce((s, q) => s + q.weight, 0)}%
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedTemplate.kpis?.map((kpi) => (
                    <div key={kpi.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                      <div>
                        <h3 className="font-medium text-slate-900">{kpi.name}</h3>
                        <p className="text-sm text-slate-500">Meta: {kpi.target} {kpi.unit}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">{"<"}{kpi.thresholds.red}%</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">{kpi.thresholds.red}-{kpi.thresholds.yellow}%</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">{">"}{kpi.thresholds.green}%</span>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-slate-900">{kpi.weight}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Selecciona una plantilla para ver y editar</p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Generar Enlace de Evaluación</h3>
              <button onClick={() => { setShowLinkModal(false); setGeneratedLink(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!generatedLink ? (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Empleado a evaluar</label>
                    <select 
                      value={linkConfig.employeeId}
                      onChange={(e) => setLinkConfig(prev => ({ ...prev, employeeId: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5"
                    >
                      <option value="">Seleccionar empleado...</option>
                      {mockEmployees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name} - {emp.position}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de evaluador</label>
                    <div className="grid grid-cols-2 gap-2">
                      {evaluatorTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setLinkConfig(prev => ({ ...prev, evaluatorType: type.id }))}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                            linkConfig.evaluatorType === type.id 
                              ? 'border-slate-900 bg-slate-50' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <type.icon className="w-4 h-4" style={{ color: type.color }} />
                          <span className="text-sm font-medium">{type.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={generateLink}
                  disabled={!linkConfig.employeeId}
                  className="w-full bg-slate-900 text-white rounded-xl px-4 py-3 font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generar Enlace
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-slate-600 mb-4">Enlace generado exitosamente</p>
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <p className="text-sm font-mono text-slate-700 break-all">{generatedLink}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedLink)}
                    className="flex-1 bg-slate-900 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-slate-800 flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar Enlace
                  </button>
                  <button
                    onClick={() => { setShowLinkModal(false); setGeneratedLink(null); }}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// KPIs MANAGEMENT COMPONENT
// ============================================

const KPIsView = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [kpis, setKpis] = useState([
    { id: 'kpi-new-1', name: 'Productividad', type: 'numeric', unit: '%', thresholds: { red: 50, yellow: 75, green: 90 } },
    { id: 'kpi-new-2', name: 'Satisfacción del Cliente', type: 'scale', unit: 'pts', thresholds: { red: 60, yellow: 80, green: 90 } },
  ]);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [myEntries, setMyEntries] = useState(mockKPIEntries);
  const [showSmartModal, setShowSmartModal] = useState(false);

  const tabs = [
    { id: 'create', label: 'Crear KPIs', icon: Plus },
    { id: 'fill', label: 'Mis KPIs', icon: ClipboardEdit },
    { id: 'review', label: 'Revisión', icon: CheckCircle2 },
    { id: 'compare', label: 'Comparativa', icon: BarChart2 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Gestión de KPIs
          </h1>
          <p className="text-slate-500 mt-1">Crea, gestiona y revisa indicadores clave de desempeño</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Create KPIs Tab */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Definir Nuevo KPI</h2>
              <button className="bg-slate-900 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-slate-800 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Guardar KPI
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nombre del KPI</label>
                  <input type="text" placeholder="Ej: Ventas mensuales" className="w-full border border-slate-200 rounded-xl px-4 py-2.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5">
                    <option value="numeric">Numérico</option>
                    <option value="percentage">Porcentaje</option>
                    <option value="currency">Monetario</option>
                    <option value="scale">Escala</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Unidad de medida</label>
                <input type="text" placeholder="Ej: %, $, pts, unidades" className="w-full border border-slate-200 rounded-xl px-4 py-2.5" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-4">Umbrales de Color</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-sm font-medium text-red-700">Rojo (Bajo)</span>
                    </div>
                    <input type="number" placeholder="< 50%" className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm bg-white" />
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-sm font-medium text-yellow-700">Amarillo (Medio)</span>
                    </div>
                    <input type="number" placeholder="50-75%" className="w-full border border-yellow-200 rounded-lg px-3 py-2 text-sm bg-white" />
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm font-medium text-green-700">Verde (Alto)</span>
                    </div>
                    <input type="number" placeholder="> 90%" className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">KPIs Existentes</h2>
            <div className="space-y-3">
              {kpis.map((kpi) => (
                <div key={kpi.id} className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 cursor-pointer">
                  <h3 className="font-medium text-slate-900">{kpi.name}</h3>
                  <p className="text-sm text-slate-500">Tipo: {kpi.type} | Unidad: {kpi.unit}</p>
                  <div className="flex gap-1 mt-2">
                    <span className="w-4 h-2 rounded-full bg-red-400" />
                    <span className="w-4 h-2 rounded-full bg-yellow-400" />
                    <span className="w-4 h-2 rounded-full bg-green-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fill My KPIs Tab */}
      {activeTab === 'fill' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Mis Indicadores - Q1 2024</h2>
              
              <div className="space-y-4">
                {mockKPIEntries.map((entry) => {
                  const kpiDef = mockEvaluationTemplates[1].kpis.find(k => k.id === entry.kpiId);
                  const percentage = Math.round((entry.value / entry.target) * 100);
                  const color = percentage >= kpiDef?.thresholds.green ? 'green' : percentage >= kpiDef?.thresholds.yellow ? 'yellow' : 'red';
                  
                  return (
                    <div key={entry.id} className="border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{kpiDef?.name}</h3>
                          <p className="text-sm text-slate-500">{entry.smartGoal}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          entry.status === 'approved' ? 'bg-green-100 text-green-700' :
                          entry.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {entry.status === 'approved' ? 'Aprobado' : entry.status === 'pending' ? 'Pendiente' : 'En Revisión'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">Progreso</span>
                            <span className="font-medium">{entry.value.toLocaleString()} / {entry.target.toLocaleString()}</span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${color === 'green' ? 'bg-green-500' : color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className={`text-2xl font-bold ${color === 'green' ? 'text-green-600' : color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
                          {percentage}%
                        </span>
                      </div>
                      
                      {entry.feedback && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-500 mb-1">Feedback del líder:</p>
                          <p className="text-sm text-slate-700">{entry.feedback}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Agregar Meta SMART</h2>
              <button 
                onClick={() => setShowSmartModal(true)}
                className="w-full bg-slate-900 text-white rounded-xl px-4 py-3 font-medium hover:bg-slate-800 flex items-center justify-center gap-2"
              >
                <Flag className="w-4 h-4" />
                Nueva Meta SMART
              </button>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <p className="text-xs font-semibold text-blue-700 mb-2">¿Qué es SMART?</p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li><strong>S</strong>pecific - Específico</li>
                  <li><strong>M</strong>easurable - Medible</li>
                  <li><strong>A</strong>chievable - Alcanzable</li>
                  <li><strong>R</strong>elevant - Relevante</li>
                  <li><strong>T</strong>ime-bound - Temporal</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Tab */}
      {activeTab === 'review' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">KPIs Pendientes de Revisión</h2>
          
          <div className="space-y-4">
            {myEntries.filter(e => e.status !== 'approved').map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <img src={mockEmployees.find(e => e.id === entry.employeeId)?.avatar} alt="" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-medium text-slate-900">{mockEmployees.find(e => e.id === entry.employeeId)?.name}</p>
                    <p className="text-sm text-slate-500">{mockEvaluationTemplates[1].kpis.find(k => k.id === entry.kpiId)?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">{Math.round((entry.value / entry.target) * 100)}%</span>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Aprobar">
                    <ThumbsUp className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Rechazar">
                    <ThumbsDown className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compare Tab */}
      {activeTab === 'compare' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Rendimiento por Equipo</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockDepartments.map(d => ({
                name: d.name.substring(0, 8),
                kpi: Math.round(mockEmployees.filter(e => e.departmentId === d.id).reduce((a, e) => a + e.kpiScore, 0) / Math.max(mockEmployees.filter(e => e.departmentId === d.id).length, 1))
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="kpi" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Evolución Temporal</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { month: 'Ene', promedio: 65 },
                { month: 'Feb', promedio: 68 },
                { month: 'Mar', promedio: 72 },
                { month: 'Abr', promedio: 70 },
                { month: 'May', promedio: 75 },
                { month: 'Jun', promedio: 78 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="promedio" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// MANUAL EVALUATION COMPONENT
// ============================================

const ManualEvaluation = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedClassification, setSelectedClassification] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const matrixCells = [
    { code: "C1", label: "Valores sin Resultados", color: "orange" },
    { code: "B2", label: "Futuro Líder", color: "yellow" },
    { code: "A", label: "Top Performer", color: "green" },
    { code: "C3", label: "Necesita Desarrollo", color: "red-light" },
    { code: "B3", label: "Performer Sólido", color: "orange-light" },
    { code: "B1", label: "Alto Potencial", color: "yellow" },
    { code: "C4", label: "Acción Urgente", color: "red" },
    { code: "C2", label: "Bajo Rendimiento", color: "red-light" },
    { code: "B4", label: "Resultados sin Valores", color: "orange" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
          Evaluación Manual
        </h1>
        <p className="text-slate-500 mt-1">Asigna directamente un cuadrante del 9-Box a un empleado</p>
      </div>

      {/* Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Evaluación por Override</p>
            <p className="text-sm text-amber-700">Esta clasificación sobrescribirá el resultado calculado automáticamente. Usa esta opción cuando tengas información adicional que justifique un cambio.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Selection */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">1. Seleccionar Empleado</h2>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {mockEmployees.map((emp) => {
              const classification = getEmployeeClassification(emp);
              const colors = classificationColors[classification.color];
              
              return (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                    selectedEmployee?.id === emp.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={emp.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{emp.name}</p>
                    <p className="text-sm text-slate-500">{emp.position} · {emp.department}</p>
                  </div>
                  <div className="text-right">
                    <span 
                      className="inline-flex px-3 py-1 rounded-lg text-sm font-bold"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {classification.code}
                    </span>
                    {emp.manualOverride && (
                      <p className="text-xs text-amber-600 mt-1">Override activo</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Classification Selection */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">2. Seleccionar Clasificación</h2>
          
          {selectedEmployee ? (
            <>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {matrixCells.map((cell) => {
                  const colors = classificationColors[cell.color];
                  const isSelected = selectedClassification === cell.code;
                  
                  return (
                    <button
                      key={cell.code}
                      onClick={() => setSelectedClassification(cell.code)}
                      className={`rounded-xl border-2 p-4 text-center transition-all ${
                        isSelected ? 'ring-2 ring-slate-900 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                    >
                      <span className="text-2xl font-bold" style={{ color: colors.text }}>{cell.code}</span>
                      <p className="text-xs mt-1" style={{ color: colors.text }}>{cell.label}</p>
                    </button>
                  );
                })}
              </div>

              {selectedClassification && (
                <div className="animate-fade-in">
                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-slate-600">
                      <strong>{selectedEmployee.name}</strong> será clasificado como <strong>{selectedClassification}</strong>
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Justificación (opcional)</label>
                    <textarea 
                      rows={3}
                      placeholder="Explica el motivo del override..."
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 resize-none"
                    />
                  </div>

                  <button 
                    onClick={() => setShowConfirm(true)}
                    className="w-full bg-slate-900 text-white rounded-xl px-4 py-3 font-medium hover:bg-slate-800"
                  >
                    Aplicar Clasificación
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Selecciona un empleado primero</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-fade-in text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">¡Clasificación Aplicada!</h3>
            <p className="text-sm text-slate-500 mb-6">
              {selectedEmployee?.name} ha sido clasificado como {selectedClassification}
            </p>
            <button
              onClick={() => { setShowConfirm(false); setSelectedClassification(null); }}
              className="w-full bg-slate-900 text-white rounded-xl px-4 py-2.5 font-medium hover:bg-slate-800"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// RESULTS VIEW COMPONENT
// ============================================

const ResultsView = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(mockEmployees[0]);

  const radarData = [
    { subject: 'Comunicación', score: 85, fullMark: 100 },
    { subject: 'Trabajo en Equipo', score: 78, fullMark: 100 },
    { subject: 'Liderazgo', score: 72, fullMark: 100 },
    { subject: 'Orientación a Resultados', score: 88, fullMark: 100 },
  ];

  const pieData = [
    { name: 'Líder', value: 30, color: '#3B82F6' },
    { name: 'Pares', value: 25, color: '#8B5CF6' },
    { name: 'Clientes', value: 25, color: '#10B981' },
    { name: 'Autoevaluación', value: 20, color: '#EC4899' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Resultados de Evaluación
          </h1>
          <p className="text-slate-500 mt-1">Visualiza el desempeño detallado por empleado</p>
        </div>
        
        <div className="relative">
          <select
            value={selectedEmployee?.id || ''}
            onChange={(e) => setSelectedEmployee(mockEmployees.find(emp => emp.id === e.target.value))}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm"
          >
            {mockEmployees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Employee Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-6">
          <img src={selectedEmployee?.avatar} alt="" className="w-20 h-20 rounded-xl object-cover" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900">{selectedEmployee?.name}</h2>
            <p className="text-slate-500">{selectedEmployee?.position} · {selectedEmployee?.department}</p>
          </div>
          {(() => {
            const classification = getEmployeeClassification(selectedEmployee);
            const colors = classificationColors[classification.color];
            return (
              <div className="text-center">
                <div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl text-3xl font-bold"
                  style={{ backgroundColor: colors.bg, color: colors.text, border: `2px solid ${colors.border}` }}
                >
                  {classification.code}
                </div>
                <p className="text-sm text-slate-500 mt-2">{classification.label}</p>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Gráfica de Araña - Competencias</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Desglose por Evaluador</h2>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPie>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPie>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-600">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Scores */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Puntuaciones Detalladas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'KPI', value: selectedEmployee?.kpiScore, color: '#3B82F6' },
              { label: 'Valores 360', value: selectedEmployee?.valuesScore, color: '#8B5CF6' },
              { label: 'Autoevaluación', value: selectedEmployee?.autoEvalScore, color: '#EC4899' },
              { label: 'Líder', value: selectedEmployee?.leaderEvalScore, color: '#10B981' },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-sm text-slate-500 mb-2">{item.label}</p>
                <p className="text-4xl font-bold" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PUBLIC EVALUATION FORM (for links)
// ============================================

const PublicEvaluationForm = () => {
  const { token } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const template = mockEvaluationTemplates[0];
  const employee = mockEmployees[0];
  const categories = template.categories;

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const currentCategory = categories[currentStep];
  const isLastStep = currentStep === categories.length - 1;
  const categoryAnswered = currentCategory?.questions.every(q => answers[q.id]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">¡Gracias por tu evaluación!</h1>
          <p className="text-slate-500 mb-6">Tu feedback ha sido registrado exitosamente y ayudará en el desarrollo profesional de {employee.name}.</p>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-sm text-slate-600">Esta ventana se puede cerrar.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <img src={employee.avatar} alt="" className="w-16 h-16 rounded-xl object-cover" />
            <div>
              <p className="text-sm text-slate-500">Evaluación para:</p>
              <h2 className="text-xl font-semibold text-slate-900">{employee.name}</h2>
              <p className="text-sm text-slate-500">{employee.position}</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="flex gap-2">
            {categories.map((_, idx) => (
              <div 
                key={idx}
                className={`flex-1 h-2 rounded-full transition-all ${
                  idx < currentStep ? 'bg-green-500' : idx === currentStep ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-2">Paso {currentStep + 1} de {categories.length}</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900">{currentCategory?.name}</h3>
            <p className="text-sm text-slate-500">{currentCategory?.description}</p>
          </div>

          <div className="space-y-6">
            {currentCategory?.questions.map((q) => (
              <div key={q.id}>
                <p className="text-slate-700 mb-3">{q.text}</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleAnswer(q.id, val)}
                      className={`flex-1 h-12 rounded-xl border-2 font-semibold transition-all ${
                        answers[q.id] === val
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Muy bajo</span>
                  <span>Excelente</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-6 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50"
              >
                Anterior
              </button>
            )}
            <button
              onClick={() => isLastStep ? setSubmitted(true) : setCurrentStep(prev => prev + 1)}
              disabled={!categoryAnswered}
              className="flex-1 bg-slate-900 text-white rounded-xl px-6 py-3 font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLastStep ? 'Enviar Evaluación' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EMPLOYEES LIST COMPONENT
// ============================================

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === "all" || emp.departmentId === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Empleados
          </h1>
          <p className="text-slate-500 mt-1">Gestión del personal</p>
        </div>
        <button className="bg-slate-900 text-white rounded-xl px-4 py-2.5 font-medium hover:bg-slate-800 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar Empleado
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar empleado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
          >
            <option value="all">Todos los departamentos</option>
            {mockDepartments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Empleado</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Departamento</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase px-6 py-4">KPI</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase px-6 py-4">360</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase px-6 py-4">Clasificación</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map((emp) => {
              const classification = getEmployeeClassification(emp);
              const colors = classificationColors[classification.color];
              
              return (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-slate-900">{emp.name}</p>
                        <p className="text-sm text-slate-500">{emp.position}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{emp.department}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-semibold ${emp.kpiScore > 66 ? 'text-green-600' : emp.kpiScore > 33 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {emp.kpiScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-semibold ${emp.valuesScore > 66 ? 'text-green-600' : emp.valuesScore > 33 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {emp.valuesScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span 
                      className="inline-flex px-3 py-1 rounded-lg font-bold text-sm"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {classification.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
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

// ============================================
// MAIN LAYOUT & APP
// ============================================

const Layout = ({ children }) => (
  <div className="flex min-h-screen bg-[#FAFAFA]">
    <Sidebar />
    <main className="flex-1 p-8 overflow-auto">
      <div className="max-w-6xl mx-auto">{children}</div>
    </main>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public evaluation route (no sidebar) */}
        <Route path="/evaluate/:token" element={<PublicEvaluationForm />} />
        
        {/* Main app routes */}
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/9box" element={<NineBoxGridView />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/evaluations" element={<EvaluationsView />} />
              <Route path="/kpis" element={<KPIsView />} />
              <Route path="/manual-eval" element={<ManualEvaluation />} />
              <Route path="/results" element={<ResultsView />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
