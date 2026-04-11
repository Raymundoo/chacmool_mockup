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
  Star,
  Info,
  ArrowUp,
  ArrowRight,
  UserPlus,
  Mail,
  EyeOff,
  Shield,
  Percent,
  Save,
  PlusCircle,
  MinusCircle
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart as RechartsPie, Pie, Cell } from 'recharts';

// ============================================
// USER ROLE (for demo - toggle between admin/employee)
// ============================================
const useUserRole = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  return { isAdmin, setIsAdmin };
};

// ============================================
// CLASSIFICATION SYSTEM - "EMPLEADO A" naming
// ============================================

const classificationMatrix = {
  "A": { 
    valores: { min: 81, max: 100 }, 
    resultados: { min: 81, max: 100 },
    label: "Empleado A", 
    shortDesc: "Top Performer",
    description: "Espectaculares. Da resultados. Independientes. Les das qué hacer y traen los resultados. Aspiran a gerentes o supervisores.",
    color: "green",
    action: "Retener y desarrollar para roles de liderazgo"
  },
  "B2": { 
    valores: { min: 81, max: 100 }, 
    resultados: { min: 61, max: 80 },
    label: "Futuro A", 
    shortDesc: "Casi llega",
    description: "Tiene valores y está cerca de dar resultados completos. Con coaching puede llegar a ser Empleado A.",
    color: "yellow",
    action: "Coaching intensivo en resultados"
  },
  "B3": { 
    valores: { min: 81, max: 100 }, 
    resultados: { min: 0, max: 60 },
    label: "Quiere ser A", 
    shortDesc: "Valores sin resultados",
    description: "Tiene los valores, pero no da resultados. Está en el puesto incorrecto. La estrategia de entrenamiento no es correcta.",
    color: "orange",
    action: "Reubicar o ajustar estrategia de entrenamiento"
  },
  "B1": { 
    valores: { min: 61, max: 80 }, 
    resultados: { min: 61, max: 80 },
    label: "Performer Sólido", 
    shortDesc: "Consistente",
    description: "Tiene valores y da resultados de forma consistente. Pilar del equipo.",
    color: "yellow",
    action: "Desarrollar valores para alcanzar nivel A"
  },
  "B4": { 
    valores: { min: 61, max: 80 }, 
    resultados: { min: 81, max: 100 },
    label: "Alto Potencial", 
    shortDesc: "Muy cerca de A",
    description: "Quieren ser Empleados A. Tiene valores y da resultados. Muy cerca de lograrlo.",
    color: "yellow-light",
    action: "Reforzar valores para promoción"
  },
  "C4": { 
    valores: { min: 61, max: 80 }, 
    resultados: { min: 0, max: 60 },
    label: "En Desarrollo", 
    shortDesc: "Necesita mejora",
    description: "Valores aceptables pero resultados bajos. Requiere plan de mejora con seguimiento.",
    color: "orange",
    action: "Plan de mejora con seguimiento cercano"
  },
  "C3": { 
    valores: { min: 0, max: 60 }, 
    resultados: { min: 81, max: 100 },
    label: "Difícil de Sacar", 
    shortDesc: "Resultados sin valores",
    description: "Genera muchos resultados, pero no tiene valores. Persona que puede ser tóxica para el equipo.",
    color: "red",
    action: "Coaching urgente en valores o desvincular"
  },
  "C2": { 
    valores: { min: 0, max: 60 }, 
    resultados: { min: 61, max: 80 },
    label: "Bajo Rendimiento", 
    shortDesc: "En riesgo",
    description: "Ni valores ni resultados destacables. Necesita intervención.",
    color: "red-light",
    action: "Plan de mejora o desvincular"
  },
  "C1": { 
    valores: { min: 0, max: 60 }, 
    resultados: { min: 0, max: 60 },
    label: "Acción Urgente", 
    shortDesc: "Crítico",
    description: "Sin valores ni resultados. Requiere acción inmediata.",
    color: "red",
    action: "Desvincular"
  }
};

const classificationColors = {
  green: { bg: "#ECFDF5", border: "#10B981", text: "#047857", gradient: "from-green-500 to-emerald-600" },
  "yellow-light": { bg: "#FEF9C3", border: "#FACC15", text: "#A16207", gradient: "from-yellow-400 to-amber-500" },
  yellow: { bg: "#FFFBEB", border: "#F59E0B", text: "#B45309", gradient: "from-amber-400 to-orange-500" },
  orange: { bg: "#FFEDD5", border: "#F97316", text: "#C2410C", gradient: "from-orange-400 to-red-500" },
  "red-light": { bg: "#FEF2F2", border: "#F87171", text: "#B91C1C", gradient: "from-red-400 to-rose-500" },
  red: { bg: "#FEE2E2", border: "#EF4444", text: "#991B1B", gradient: "from-red-500 to-red-700" }
};

const getClassification = (valores, resultados) => {
  for (const [code, config] of Object.entries(classificationMatrix)) {
    if (valores >= config.valores.min && valores <= config.valores.max &&
        resultados >= config.resultados.min && resultados <= config.resultados.max) {
      return { code, ...config };
    }
  }
  return { code: "C1", ...classificationMatrix["C1"] };
};

// ============================================
// MOCK DATA
// ============================================

const mockDepartments = [
  { id: "dept-1", name: "Tecnología", color: "#3B82F6" },
  { id: "dept-2", name: "Operaciones", color: "#8B5CF6" },
  { id: "dept-3", name: "Ventas", color: "#10B981" },
  { id: "dept-4", name: "Soporte", color: "#F59E0B" },
  { id: "dept-5", name: "Administración", color: "#EC4899" },
];

const evaluatorTypes = [
  { id: "superior", name: "Superior", icon: UserCheck, color: "#3B82F6", weight: 30 },
  { id: "subordinados", name: "Subordinados", icon: Users, color: "#8B5CF6", weight: 20 },
  { id: "companeros", name: "Compañeros", icon: Users2, color: "#10B981", weight: 20 },
  { id: "clientes", name: "Clientes", icon: Briefcase, color: "#F59E0B", weight: 15 },
  { id: "autoevaluacion", name: "Autoevaluación", icon: User, color: "#EC4899", weight: 15 },
];

const competencias = [
  { id: "liderazgo", name: "Liderazgo", description: "Capacidad de guiar e inspirar a otros hacia los objetivos" },
  { id: "trabajo_equipo", name: "Trabajo en equipo", description: "Colaboración efectiva con compañeros" },
  { id: "resolucion_problemas", name: "Resolución de problemas", description: "Capacidad de analizar y resolver situaciones complejas" },
  { id: "aprendizaje_continuo", name: "Aprendizaje continuo", description: "Disposición para adquirir nuevos conocimientos" },
];

const valores = [
  { id: "hazlo_ahora", name: "Hazlo Ahora", description: "Actitud proactiva y de acción inmediata" },
  { id: "mejora_continua", name: "Mejora continua", description: "Dejar todo mejor de como lo encontraste" },
  { id: "autoaprendizaje", name: "Autoaprendizaje", description: "Iniciativa para aprender por cuenta propia" },
  { id: "alertidad", name: "Alertidad", description: "Estar atento a oportunidades y problemas" },
  { id: "amabilidad", name: "Amabilidad", description: "Trato cordial y respetuoso" },
  { id: "valor_agregado", name: "Valor Agregado", description: "Aportar más de lo esperado" },
  { id: "comunicacion_asertiva", name: "Comunicación Asertiva", description: "Expresar ideas de forma clara y respetuosa" },
];

const mockEmployees = [
  { 
    id: "EMP-001", name: "María García López", position: "Tech Lead", departmentId: "dept-1", department: "Tecnología",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    valoresScore: 92, resultadosScore: 88,
    autoEvalClassification: "A", // Lo que eligió en autoevaluación
    evaluations: { superior: 90, subordinados: 88, companeros: 85, clientes: 80, autoevaluacion: 95 },
    evaluatorCounts: { superior: 1, subordinados: 4, companeros: 6, clientes: 2 }, // Cuántos evaluaron
    evaluatorNames: { superior: ["Carlos Mendoza"], subordinados: ["Juan R.", "Laura S.", "Pedro M.", "Ana L."], companeros: ["Roberto D.", "Patricia L.", "Fernando T.", "Sofía G.", "Miguel A.", "Elena R."], clientes: ["Cliente Corp A", "Cliente Corp B"] },
    manualOverride: null
  },
  { 
    id: "EMP-002", name: "Juan Rodríguez", position: "Desarrollador Sr", departmentId: "dept-1", department: "Tecnología",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    valoresScore: 85, resultadosScore: 75,
    autoEvalClassification: "A",
    evaluations: { superior: 82, subordinados: 78, companeros: 80, clientes: 75, autoevaluacion: 88 },
    evaluatorCounts: { superior: 1, subordinados: 0, companeros: 5, clientes: 3 },
    evaluatorNames: { superior: ["María García"], subordinados: [], companeros: ["Laura S.", "Pedro M.", "Ana L.", "Roberto D.", "Patricia L."], clientes: ["TechCorp", "DataSoft", "CloudInc"] },
    manualOverride: null
  },
  { 
    id: "EMP-003", name: "Laura Sánchez", position: "Gerente de Operaciones", departmentId: "dept-2", department: "Operaciones",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    valoresScore: 95, resultadosScore: 55,
    autoEvalClassification: "B2",
    evaluations: { superior: 70, subordinados: 92, companeros: 88, clientes: 65, autoevaluacion: 90 },
    evaluatorCounts: { superior: 1, subordinados: 8, companeros: 4, clientes: 5 },
    evaluatorNames: { superior: ["Director Ops"], subordinados: ["Emp1", "Emp2", "Emp3", "Emp4", "Emp5", "Emp6", "Emp7", "Emp8"], companeros: ["Juan R.", "María G.", "Carlos M.", "Ana L."], clientes: ["Proveedor A", "Proveedor B", "Proveedor C", "Proveedor D", "Proveedor E"] },
    manualOverride: null
  },
  { 
    id: "EMP-004", name: "Carlos Mendoza", position: "Ejecutivo de Ventas", departmentId: "dept-3", department: "Ventas",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    valoresScore: 45, resultadosScore: 92,
    autoEvalClassification: "B4",
    evaluations: { superior: 85, subordinados: 40, companeros: 35, clientes: 90, autoevaluacion: 75 },
    evaluatorCounts: { superior: 1, subordinados: 2, companeros: 7, clientes: 12 },
    evaluatorNames: { superior: ["Director Ventas"], subordinados: ["Asistente 1", "Asistente 2"], companeros: ["V1", "V2", "V3", "V4", "V5", "V6", "V7"], clientes: ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11", "C12"] },
    manualOverride: null
  },
  { 
    id: "EMP-005", name: "Ana Martínez", position: "Coordinadora de Soporte", departmentId: "dept-4", department: "Soporte",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    valoresScore: 72, resultadosScore: 78,
    autoEvalClassification: "B1",
    evaluations: { superior: 75, subordinados: 72, companeros: 78, clientes: 80, autoevaluacion: 70 },
    evaluatorCounts: { superior: 1, subordinados: 3, companeros: 4, clientes: 8 },
    evaluatorNames: { superior: ["Jefe Soporte"], subordinados: ["Técnico 1", "Técnico 2", "Técnico 3"], companeros: ["Comp1", "Comp2", "Comp3", "Comp4"], clientes: ["Usuario1", "Usuario2", "Usuario3", "Usuario4", "Usuario5", "Usuario6", "Usuario7", "Usuario8"] },
    manualOverride: null
  },
  { 
    id: "EMP-006", name: "Roberto Díaz", position: "Vendedor", departmentId: "dept-3", department: "Ventas",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    valoresScore: 78, resultadosScore: 85,
    autoEvalClassification: "A",
    evaluations: { superior: 88, subordinados: 70, companeros: 75, clientes: 85, autoevaluacion: 80 },
    evaluatorCounts: { superior: 1, subordinados: 0, companeros: 5, clientes: 15 },
    evaluatorNames: { superior: ["Carlos Mendoza"], subordinados: [], companeros: ["V1", "V2", "V3", "V4", "V5"], clientes: ["Cliente1", "Cliente2", "..."] },
    manualOverride: null
  },
  { 
    id: "EMP-007", name: "Patricia Luna", position: "Asistente Admin", departmentId: "dept-5", department: "Administración",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    valoresScore: 35, resultadosScore: 42,
    autoEvalClassification: "C4",
    evaluations: { superior: 40, subordinados: 35, companeros: 38, clientes: 45, autoevaluacion: 55 },
    evaluatorCounts: { superior: 1, subordinados: 0, companeros: 3, clientes: 2 },
    evaluatorNames: { superior: ["Director Admin"], subordinados: [], companeros: ["Comp1", "Comp2", "Comp3"], clientes: ["Proveedor1", "Proveedor2"] },
    manualOverride: null
  },
  { 
    id: "EMP-008", name: "Fernando Torres", position: "Técnico de Soporte", departmentId: "dept-4", department: "Soporte",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    valoresScore: 50, resultadosScore: 70,
    autoEvalClassification: "B1",
    evaluations: { superior: 65, subordinados: 55, companeros: 60, clientes: 72, autoevaluacion: 68 },
    evaluatorCounts: { superior: 1, subordinados: 0, companeros: 4, clientes: 20 },
    evaluatorNames: { superior: ["Ana Martínez"], subordinados: [], companeros: ["Comp1", "Comp2", "Comp3", "Comp4"], clientes: ["Muchos usuarios..."] },
    manualOverride: null
  }
];

// Mock evaluation templates
const mockEvaluationTemplates = [
  {
    id: "eval-1",
    name: "Evaluación 360° Estándar",
    description: "Evaluación integral de competencias y valores para todos los empleados",
    type: "360",
    isActive: true,
    assignedPositions: ["Todos"],
    sections: [
      {
        id: "sec-competencias",
        name: "Competencias necesarias para desempeñar su cargo",
        weight: 50,
        items: competencias.map((c, i) => ({ ...c, weight: 25 }))
      },
      {
        id: "sec-valores",
        name: "Valores",
        weight: 50,
        items: valores.map((v, i) => ({ ...v, weight: Math.round(100 / valores.length) }))
      }
    ],
    scale: [
      { value: 1, label: "Nunca demuestra" },
      { value: 2, label: "Rara vez demuestra" },
      { value: 3, label: "A veces demuestra" },
      { value: 4, label: "Frecuentemente demuestra" },
      { value: 5, label: "Siempre demuestra" },
    ]
  },
  {
    id: "eval-2",
    name: "Evaluación Técnica",
    description: "Para posiciones técnicas y de desarrollo",
    type: "360",
    isActive: true,
    assignedPositions: ["Desarrollador", "Tech Lead", "Técnico"],
    sections: [
      {
        id: "sec-tech",
        name: "Habilidades Técnicas",
        weight: 60,
        items: [
          { id: "calidad_codigo", name: "Calidad de código", weight: 30 },
          { id: "arquitectura", name: "Diseño de arquitectura", weight: 25 },
          { id: "debugging", name: "Resolución de bugs", weight: 25 },
          { id: "documentacion", name: "Documentación", weight: 20 },
        ]
      },
      {
        id: "sec-soft",
        name: "Habilidades Blandas",
        weight: 40,
        items: [
          { id: "comunicacion_tech", name: "Comunicación técnica", weight: 50 },
          { id: "mentoria", name: "Mentoría", weight: 50 },
        ]
      }
    ],
    scale: [
      { value: 1, label: "Nunca demuestra" },
      { value: 2, label: "Rara vez demuestra" },
      { value: 3, label: "A veces demuestra" },
      { value: 4, label: "Frecuentemente demuestra" },
      { value: 5, label: "Siempre demuestra" },
    ]
  }
];

// Mock KPI templates
const mockKPITemplates = [
  {
    id: "kpi-template-1",
    name: "KPIs Comerciales",
    description: "Para el área de ventas",
    assignedDepartments: ["Ventas"],
    kpis: [
      { id: "ventas", name: "Ventas mensuales", weight: 40, unit: "$", target: 100000, thresholds: { red: 60, yellow: 80, green: 100 } },
      { id: "clientes", name: "Clientes nuevos", weight: 30, unit: "clientes", target: 10, thresholds: { red: 50, yellow: 70, green: 90 } },
      { id: "retencion", name: "Retención", weight: 30, unit: "%", target: 95, thresholds: { red: 70, yellow: 85, green: 95 } },
    ]
  },
  {
    id: "kpi-template-2",
    name: "KPIs Soporte",
    description: "Para el área de soporte técnico",
    assignedDepartments: ["Soporte"],
    kpis: [
      { id: "tickets", name: "Tickets resueltos", weight: 40, unit: "tickets", target: 100, thresholds: { red: 50, yellow: 75, green: 90 } },
      { id: "tiempo", name: "Tiempo promedio resolución", weight: 35, unit: "hrs", target: 4, thresholds: { red: 60, yellow: 80, green: 95 } },
      { id: "satisfaccion", name: "Satisfacción cliente", weight: 25, unit: "%", target: 90, thresholds: { red: 60, yellow: 80, green: 90 } },
    ]
  }
];

// Auto-adjust weights
const autoAdjustWeights = (items, changedId, newWeight, totalTarget = 100) => {
  const otherItems = items.filter(i => i.id !== changedId);
  const remainingWeight = Math.max(0, totalTarget - newWeight);
  const currentOtherTotal = otherItems.reduce((sum, i) => sum + i.weight, 0);
  
  if (currentOtherTotal === 0 || otherItems.length === 0) {
    return items.map(i => i.id === changedId ? { ...i, weight: newWeight } : i);
  }
  
  const ratio = remainingWeight / currentOtherTotal;
  return items.map(i => {
    if (i.id === changedId) return { ...i, weight: newWeight };
    return { ...i, weight: Math.round(i.weight * ratio) };
  });
};

// ============================================
// SIDEBAR
// ============================================

const Sidebar = ({ isAdmin, setIsAdmin }) => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard", description: "Vista general" },
    { path: "/9box", icon: Grid3X3, label: "Matriz 9-Box", description: "Empleados A, B, C" },
    { path: "/employees", icon: Users, label: "Empleados", description: "Gestión de personal" },
    { path: "/evaluations", icon: MessageSquare, label: "Evaluaciones 360", description: "Plantillas y enlaces" },
    { path: "/kpis", icon: Target, label: "KPIs", description: "Indicadores clave" },
    { path: "/my-profile", icon: User, label: "Mi Perfil / Resultados", description: "Ver mi evaluación" },
    { path: "/manual-eval", icon: ClipboardEdit, label: "Evaluación Manual", description: "Override directo" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Outfit' }}>EvalPro</h1>
            <p className="text-xs text-slate-500">Sistema 360°</p>
          </div>
        </div>
      </div>

      {/* Role Toggle */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between bg-slate-50 rounded-xl p-2">
          <button
            onClick={() => setIsAdmin(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
              isAdmin ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
            }`}
          >
            <Shield className="w-3 h-3" />
            Admin
          </button>
          <button
            onClick={() => setIsAdmin(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
              !isAdmin ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
            }`}
          >
            <User className="w-3 h-3" />
            Empleado
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
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
              >
                <item.icon className="w-5 h-5" />
                <div className="flex-1">
                  <span className="block">{item.label}</span>
                  <span className="text-xs text-slate-400">{item.description}</span>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className={`rounded-xl p-4 text-white ${isAdmin ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-purple-600 to-purple-700'}`}>
          <p className="text-xs font-semibold mb-1">{isAdmin ? '👑 Modo Admin' : '👤 Modo Empleado'}</p>
          <p className="text-xs opacity-70">{isAdmin ? 'Ves quién evaluó' : 'Ves cuántos evaluaron'}</p>
        </div>
      </div>
    </aside>
  );
};

// ============================================
// 9-BOX GRID WITH PERCENTAGES INSIDE CELLS
// ============================================

const NineBoxGridView = ({ isAdmin }) => {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();

  const filteredEmployees = selectedDepartment === "all" 
    ? mockEmployees 
    : mockEmployees.filter(e => e.departmentId === selectedDepartment);

  // Matrix with percentages inside each cell
  const matrixCells = [
    { row: 0, col: 0, code: "B3", valoresRange: "81-100%", resultadosRange: "0-60%" },
    { row: 0, col: 1, code: "B2", valoresRange: "81-100%", resultadosRange: "61-80%" },
    { row: 0, col: 2, code: "A", valoresRange: "81-100%", resultadosRange: "81-100%" },
    { row: 1, col: 0, code: "C4", valoresRange: "61-80%", resultadosRange: "0-60%" },
    { row: 1, col: 1, code: "B1", valoresRange: "61-80%", resultadosRange: "61-80%" },
    { row: 1, col: 2, code: "B4", valoresRange: "61-80%", resultadosRange: "81-100%" },
    { row: 2, col: 0, code: "C1", valoresRange: "0-60%", resultadosRange: "0-60%" },
    { row: 2, col: 1, code: "C2", valoresRange: "0-60%", resultadosRange: "61-80%" },
    { row: 2, col: 2, code: "C3", valoresRange: "0-60%", resultadosRange: "81-100%" },
  ];

  const getEmployeesInCell = (code) => {
    return filteredEmployees.filter(emp => getClassification(emp.valoresScore, emp.resultadosScore).code === code);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Empleado A
          </h1>
          <p className="text-slate-500 mt-1">Clasificación de Empleados A, B y C</p>
        </div>
        
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
        >
          <option value="all">Todos los departamentos</option>
          {mockDepartments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">Matriz de Clasificación de Empleados</p>
            <p className="text-sm text-blue-700">
              <strong>Eje Y:</strong> VALORES (comportamientos y actitudes) | <strong>Eje X:</strong> RESULTADOS (cumplimiento de metas).
              Los porcentajes dentro de cada celda indican los rangos de clasificación.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matrix */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex">
            {/* Y-axis */}
            <div className="flex flex-col justify-center items-center w-12 mr-3">
              <ArrowUp className="w-4 h-4 text-slate-400 mb-2" />
              <span className="text-xs font-bold text-slate-600 tracking-wider" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                VALORES
              </span>
            </div>
            
            <div className="flex-1">
              {/* Grid */}
              <div className="grid grid-cols-3 gap-2">
                {matrixCells.map((cell) => {
                  const config = classificationMatrix[cell.code];
                  const colors = classificationColors[config.color];
                  const cellEmployees = getEmployeesInCell(cell.code);
                  const isHighlighted = selectedEmployee && getClassification(selectedEmployee.valoresScore, selectedEmployee.resultadosScore).code === cell.code;
                  
                  return (
                    <div
                      key={cell.code}
                      className={`rounded-xl border-2 p-3 min-h-[160px] transition-all cursor-pointer hover:scale-[1.01] ${
                        isHighlighted ? 'ring-2 ring-slate-900 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                    >
                      {/* Header with code and count */}
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl font-bold" style={{ color: colors.text }}>{cell.code}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/70" style={{ color: colors.text }}>
                          {cellEmployees.length}
                        </span>
                      </div>
                      
                      {/* Label */}
                      <p className="text-xs font-semibold mb-1" style={{ color: colors.text }}>{config.label}</p>
                      
                      {/* Percentages INSIDE the cell */}
                      <div className="bg-white/50 rounded-lg px-2 py-1 mb-2">
                        <p className="text-[10px] font-medium" style={{ color: colors.text }}>
                          V: {cell.valoresRange}
                        </p>
                        <p className="text-[10px] font-medium" style={{ color: colors.text }}>
                          R: {cell.resultadosRange}
                        </p>
                      </div>
                      
                      {/* Employee names */}
                      <div className="space-y-1">
                        {cellEmployees.slice(0, 3).map((emp) => (
                          <button
                            key={emp.id}
                            onClick={() => setSelectedEmployee(emp)}
                            className={`w-full flex items-center gap-1.5 p-1 rounded-lg transition-all text-left ${
                              selectedEmployee?.id === emp.id ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                            }`}
                          >
                            <img src={emp.avatar} alt="" className="w-5 h-5 rounded-full" />
                            <span className="text-xs font-medium truncate" style={{ color: colors.text }}>
                              {emp.name.split(' ')[0]}
                            </span>
                          </button>
                        ))}
                        {cellEmployees.length > 3 && (
                          <p className="text-xs text-center font-medium" style={{ color: colors.text }}>+{cellEmployees.length - 3} más</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* X-axis */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-xs font-bold text-slate-600 tracking-wider">RESULTADOS</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Employee Detail */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Detalle del Empleado
          </h2>
          
          {selectedEmployee ? (
            <div className="animate-fade-in">
              <div className="flex items-center gap-4 mb-4">
                <img src={selectedEmployee.avatar} alt="" className="w-14 h-14 rounded-xl object-cover" />
                <div>
                  <h3 className="font-semibold text-slate-900">{selectedEmployee.name}</h3>
                  <p className="text-sm text-slate-500">{selectedEmployee.position}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{selectedEmployee.department}</span>
                </div>
              </div>

              {/* Classification */}
              {(() => {
                const classification = getClassification(selectedEmployee.valoresScore, selectedEmployee.resultadosScore);
                const colors = classificationColors[classification.color];
                return (
                  <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: colors.bg, border: `2px solid ${colors.border}` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold" style={{ color: colors.text }}>{classification.code}</span>
                      <span className="text-sm font-semibold" style={{ color: colors.text }}>{classification.label}</span>
                    </div>
                    <p className="text-xs" style={{ color: colors.text }}>{classification.description}</p>
                    <div className="mt-2 pt-2 border-t" style={{ borderColor: colors.border }}>
                      <p className="text-xs font-semibold" style={{ color: colors.text }}>Acción: {classification.action}</p>
                    </div>
                  </div>
                );
              })()}

              {/* Scores */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Valores</span>
                  <span className="font-bold text-purple-600">{selectedEmployee.valoresScore}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Resultados</span>
                  <span className="font-bold text-blue-600">{selectedEmployee.resultadosScore}%</span>
                </div>
              </div>

              {/* Evaluator counts - Different view for admin vs employee */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
                  {isAdmin ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {isAdmin ? 'Quiénes evaluaron' : 'Cuántos evaluaron'}
                </p>
                <div className="space-y-2">
                  {evaluatorTypes.filter(t => t.id !== 'autoevaluacion').map((type) => (
                    <div key={type.id} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 flex items-center gap-2">
                        <type.icon className="w-3 h-3" style={{ color: type.color }} />
                        {type.name}
                      </span>
                      {isAdmin ? (
                        <span className="text-xs text-slate-500 max-w-[120px] truncate" title={selectedEmployee.evaluatorNames[type.id]?.join(', ')}>
                          {selectedEmployee.evaluatorNames[type.id]?.slice(0, 2).join(', ')}
                          {selectedEmployee.evaluatorNames[type.id]?.length > 2 && '...'}
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-700">
                          {selectedEmployee.evaluatorCounts[type.id]} personas
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => navigate('/my-profile', { state: { employee: selectedEmployee } })}
                className="w-full mt-4 bg-slate-900 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-slate-800"
              >
                Ver Perfil Completo
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Selecciona un empleado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MY PROFILE / RESULTS VIEW (Combined)
// ============================================

const MyProfileResultsView = ({ isAdmin }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(mockEmployees[0]);
  const location = useLocation();
  
  // If coming from another view with a selected employee
  useState(() => {
    if (location.state?.employee) {
      setSelectedEmployee(location.state.employee);
    }
  }, [location]);

  const classification = getClassification(selectedEmployee.valoresScore, selectedEmployee.resultadosScore);
  const colors = classificationColors[classification.color];
  const autoClassification = classificationMatrix[selectedEmployee.autoEvalClassification];
  const autoColors = classificationColors[autoClassification?.color || 'yellow'];

  const radarData = competencias.map(c => ({ 
    subject: c.name, 
    score: Math.round(60 + Math.random() * 35), 
    fullMark: 100 
  }));

  const valoresRadarData = valores.slice(0, 5).map(v => ({ 
    subject: v.name.substring(0, 12), 
    score: Math.round(60 + Math.random() * 35), 
    fullMark: 100 
  }));

  const totalEvaluators = Object.values(selectedEmployee.evaluatorCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Perfil y Resultados
          </h1>
          <p className="text-slate-500 mt-1">Vista detallada de evaluación</p>
        </div>
        
        {isAdmin && (
          <select
            value={selectedEmployee?.id || ''}
            onChange={(e) => setSelectedEmployee(mockEmployees.find(emp => emp.id === e.target.value))}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
          >
            {mockEmployees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Employee Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <img src={selectedEmployee.avatar} alt="" className="w-24 h-24 rounded-2xl object-cover" />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-slate-900">{selectedEmployee.name}</h2>
            <p className="text-slate-500">{selectedEmployee.position} · {selectedEmployee.department}</p>
            
            {/* Evaluator count */}
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <Users className="w-4 h-4" />
              <span>Evaluado por <strong>{totalEvaluators} personas</strong></span>
            </div>
          </div>
          
          {/* Classification comparison */}
          <div className="flex gap-4">
            {/* Calculated */}
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-2">Resultado Calculado</p>
              <div 
                className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center"
                style={{ backgroundColor: colors.bg, border: `3px solid ${colors.border}` }}
              >
                <span className="text-3xl font-bold" style={{ color: colors.text }}>{classification.code}</span>
                <span className="text-xs font-medium" style={{ color: colors.text }}>{classification.label}</span>
              </div>
            </div>
            
            {/* Auto-evaluation */}
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-2">Autoevaluación</p>
              <div 
                className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed"
                style={{ backgroundColor: autoColors.bg, borderColor: autoColors.border }}
              >
                <span className="text-3xl font-bold" style={{ color: autoColors.text }}>{selectedEmployee.autoEvalClassification}</span>
                <span className="text-xs font-medium" style={{ color: autoColors.text }}>{autoClassification?.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Difference indicator */}
        {classification.code !== selectedEmployee.autoEvalClassification && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-sm text-amber-700">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              <strong>Diferencia detectada:</strong> El empleado se autoevaluó como <strong>{selectedEmployee.autoEvalClassification}</strong> pero el resultado calculado es <strong>{classification.code}</strong>.
            </p>
          </div>
        )}
      </div>

      {/* Scores and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Scores breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Puntuaciones</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Valores</span>
                <span className="font-bold text-purple-600">{selectedEmployee.valoresScore}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${selectedEmployee.valoresScore}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Resultados</span>
                <span className="font-bold text-blue-600">{selectedEmployee.resultadosScore}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${selectedEmployee.resultadosScore}%` }} />
              </div>
            </div>
          </div>

          {/* Evaluator breakdown */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
              {isAdmin ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              Por Evaluador
            </p>
            {evaluatorTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <type.icon className="w-4 h-4" style={{ color: type.color }} />
                  {type.name}
                </span>
                <div className="text-right">
                  <span className="font-semibold text-slate-900">{selectedEmployee.evaluations[type.id]}%</span>
                  {type.id !== 'autoevaluacion' && (
                    <p className="text-xs text-slate-400">
                      {isAdmin ? (
                        <span title={selectedEmployee.evaluatorNames[type.id]?.join(', ')}>
                          {selectedEmployee.evaluatorNames[type.id]?.length || 0} personas
                        </span>
                      ) : (
                        `${selectedEmployee.evaluatorCounts[type.id]} personas`
                      )}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competencias Radar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Competencias</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Valores Radar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Valores</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={valoresRadarData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action recommendation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Plan de Acción Recomendado</h3>
        <div className="p-4 rounded-xl" style={{ backgroundColor: colors.bg }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.border }}>
              <span className="text-white font-bold">{classification.code}</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900">{classification.label}</p>
              <p className="text-sm text-slate-600 mt-1">{classification.description}</p>
              <p className="text-sm font-medium mt-2" style={{ color: colors.text }}>
                → {classification.action}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EVALUATIONS VIEW - WITH CREATE TEMPLATE
// ============================================

const EvaluationsView = ({ isAdmin }) => {
  const [templates, setTemplates] = useState(mockEvaluationTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [linkConfig, setLinkConfig] = useState({ employeeId: '', evaluatorType: 'superior' });
  const [generatedLink, setGeneratedLink] = useState(null);
  
  // New template form state
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    sections: [{ id: 'sec-1', name: '', weight: 100, items: [{ id: 'item-1', name: '', description: '', weight: 100 }] }]
  });

  const handleSectionWeightChange = (sectionId, newWeight) => {
    if (!selectedTemplate) return;
    const newWeight_ = Math.max(0, Math.min(100, parseInt(newWeight) || 0));
    const updatedTemplate = {
      ...selectedTemplate,
      sections: autoAdjustWeights(selectedTemplate.sections, sectionId, newWeight_)
    };
    setSelectedTemplate(updatedTemplate);
  };

  const generateLink = () => {
    const token = Math.random().toString(36).substring(2, 10);
    setGeneratedLink(`${window.location.origin}/evaluate/${token}`);
  };

  const addSection = () => {
    setNewTemplate(prev => ({
      ...prev,
      sections: [...prev.sections, { 
        id: `sec-${Date.now()}`, 
        name: '', 
        weight: 0, 
        items: [{ id: `item-${Date.now()}`, name: '', description: '', weight: 100 }] 
      }]
    }));
  };

  const addItem = (sectionId) => {
    setNewTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(sec => 
        sec.id === sectionId 
          ? { ...sec, items: [...sec.items, { id: `item-${Date.now()}`, name: '', description: '', weight: 0 }] }
          : sec
      )
    }));
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Evaluaciones 360°
          </h1>
          <p className="text-slate-500 mt-1">Gestiona plantillas y genera enlaces de evaluación</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-slate-900 text-white rounded-xl px-4 py-2.5 font-medium hover:bg-slate-800 flex items-center gap-2"
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
          <p className="text-sm opacity-80">Múltiples perspectivas: superior, subordinados, compañeros, clientes y autoevaluación.</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
          <Sliders className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="font-semibold mb-1">Pesos Automáticos</h3>
          <p className="text-sm opacity-80">Al modificar un peso, los demás se ajustan para mantener 100%.</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
          <Link className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="font-semibold mb-1">Enlaces Públicos</h3>
          <p className="text-sm opacity-80">Comparte por WhatsApp o email. El evaluador no necesita cuenta.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Plantillas ({templates.length})</h2>
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => { setSelectedTemplate(template); setEditMode(false); }}
              className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all ${
                selectedTemplate?.id === template.id ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  360°
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${template.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {template.isActive ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{template.description}</p>
              <p className="text-xs text-slate-400 mt-2">Asignada a: {template.assignedPositions?.join(', ')}</p>
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
                    onClick={() => setShowPreviewModal(true)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Vista Previa
                  </button>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${
                      editMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    {editMode ? 'Editando' : 'Editar Pesos'}
                  </button>
                  <button
                    onClick={() => setShowLinkModal(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Link className="w-4 h-4" />
                    Generar Enlace
                  </button>
                </div>
              </div>

              {/* Sections */}
              {selectedTemplate.sections?.map((section) => (
                <div key={section.id} className="border border-slate-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">{section.name}</h3>
                    {editMode ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={section.weight}
                          onChange={(e) => handleSectionWeightChange(section.id, e.target.value)}
                          className="w-16 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold"
                        />
                        <span className="text-sm text-slate-400">%</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-slate-900">{section.weight}%</span>
                    )}
                  </div>
                  
                  <div className="space-y-2 pl-4 border-l-2 border-slate-100">
                    {section.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-1">
                        <span className="text-sm text-slate-700">{item.name}</span>
                        <span className="text-xs text-slate-400">{item.weight}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Scale */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Escala de Calificación</h4>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="flex-1 text-center">
                      <div className="w-10 h-10 mx-auto rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-900">
                        {n}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{selectedTemplate.scale?.[n-1]?.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Selecciona una plantilla para ver detalles</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Crear Nueva Plantilla 360°</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nombre de la plantilla</label>
                <input 
                  type="text" 
                  placeholder="Ej: Evaluación Gerentes 2024"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
                <textarea 
                  rows={2}
                  placeholder="Descripción breve de la evaluación..."
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 resize-none"
                />
              </div>
            </div>

            {/* Sections */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-700">Secciones</h4>
                <button 
                  onClick={addSection}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  Agregar sección
                </button>
              </div>
              
              {newTemplate.sections.map((section, secIdx) => (
                <div key={section.id} className="border border-slate-200 rounded-xl p-4 mb-3">
                  <div className="flex gap-3 mb-3">
                    <input 
                      type="text"
                      placeholder="Nombre de la sección"
                      className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    />
                    <input 
                      type="number"
                      placeholder="Peso %"
                      className="w-20 border border-slate-200 rounded-lg px-3 py-2 text-sm text-center"
                    />
                  </div>
                  
                  {section.items.map((item, itemIdx) => (
                    <div key={item.id} className="flex gap-2 mb-2 pl-4">
                      <input 
                        type="text"
                        placeholder="Pregunta o competencia"
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                      />
                      <input 
                        type="number"
                        placeholder="%"
                        className="w-16 border border-slate-200 rounded-lg px-3 py-2 text-sm text-center"
                      />
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => addItem(section.id)}
                    className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 ml-4"
                  >
                    <Plus className="w-3 h-3" />
                    Agregar pregunta
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => { setShowCreateModal(false); alert('Plantilla guardada (demo)'); }}
                className="flex-1 bg-slate-900 text-white rounded-xl px-4 py-3 font-medium hover:bg-slate-800 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar Plantilla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-50 rounded-2xl w-full max-w-2xl my-8">
            <div className="bg-white rounded-t-2xl p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Vista previa del formulario</p>
                <h3 className="font-semibold text-slate-900">{selectedTemplate.name}</h3>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {selectedTemplate.sections.map((section, secIdx) => (
                <div key={section.id} className="mb-6">
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">
                      {secIdx + 1}
                    </span>
                    {section.name}
                  </h4>
                  
                  {section.items.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl p-4 mb-3 border border-slate-200">
                      <p className="text-sm font-medium text-slate-700 mb-3">{item.name}</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            className="flex-1 h-10 rounded-lg border-2 border-slate-200 font-semibold text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>Nunca</span>
                        <span>Siempre</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            <div className="bg-white rounded-b-2xl p-4 border-t border-slate-200">
              <button className="w-full bg-slate-900 text-white rounded-xl px-4 py-3 font-medium">
                Enviar Evaluación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Generar Enlace</h3>
              <button onClick={() => { setShowLinkModal(false); setGeneratedLink(null); }} className="text-slate-400">
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
                      <option value="">Seleccionar...</option>
                      {mockEmployees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de evaluador</label>
                    <div className="grid grid-cols-2 gap-2">
                      {evaluatorTypes.filter(t => t.id !== 'autoevaluacion').map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setLinkConfig(prev => ({ ...prev, evaluatorType: type.id }))}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                            linkConfig.evaluatorType === type.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200'
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
                  className="w-full bg-slate-900 text-white rounded-xl px-4 py-3 font-medium disabled:opacity-50"
                >
                  Generar Enlace
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-slate-600 mb-4">Enlace listo para compartir</p>
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <p className="text-sm font-mono text-slate-700 break-all">{generatedLink}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedLink)}
                    className="flex-1 bg-slate-900 text-white rounded-xl px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </button>
                  <button
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Evalúa a tu compañero: ' + generatedLink)}`, '_blank')}
                    className="flex-1 bg-green-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium"
                  >
                    WhatsApp
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
// KPIs VIEW - WITH ASSIGNMENT
// ============================================

const KPIsView = ({ isAdmin }) => {
  const [activeTab, setActiveTab] = useState('templates');
  const [showCreateKPI, setShowCreateKPI] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedKPITemplate, setSelectedKPITemplate] = useState(null);

  const tabs = [
    { id: 'templates', label: 'Plantillas KPI', icon: FileText },
    { id: 'assign', label: 'Asignar a Empleados', icon: UserPlus },
    { id: 'evaluate', label: 'Evaluar KPIs', icon: ClipboardEdit },
    { id: 'compare', label: 'Comparativa', icon: BarChart2 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Gestión de KPIs
          </h1>
          <p className="text-slate-500 mt-1">Crea, asigna y evalúa indicadores clave</p>
        </div>
        <button 
          onClick={() => setShowCreateKPI(true)}
          className="bg-slate-900 text-white rounded-xl px-4 py-2.5 font-medium hover:bg-slate-800 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Crear KPI
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockKPITemplates.map((template) => (
            <div key={template.id} className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{template.name}</h3>
                  <p className="text-sm text-slate-500">{template.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { setSelectedKPITemplate(template); setShowAssignModal(true); }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-slate-400 mb-3">Asignado a: {template.assignedDepartments.join(', ')}</p>
              
              <div className="space-y-2">
                {template.kpis.map((kpi) => (
                  <div key={kpi.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{kpi.name}</p>
                      <p className="text-xs text-slate-400">Meta: {kpi.target} {kpi.unit}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-400" title={`<${kpi.thresholds.red}%`} />
                      <span className="w-3 h-3 rounded-full bg-yellow-400" title={`${kpi.thresholds.red}-${kpi.thresholds.yellow}%`} />
                      <span className="w-3 h-3 rounded-full bg-green-400" title={`>${kpi.thresholds.green}%`} />
                      <span className="text-sm font-semibold text-slate-600 ml-2">{kpi.weight}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Tab */}
      {activeTab === 'assign' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Asignar Plantilla KPI a Empleados</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Plantilla KPI</label>
              <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5">
                <option value="">Seleccionar plantilla...</option>
                {mockKPITemplates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Período</label>
              <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5">
                <option value="2024-Q1">Q1 2024</option>
                <option value="2024-Q2">Q2 2024</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Seleccionar Empleados</label>
            <div className="border border-slate-200 rounded-xl p-4 max-h-64 overflow-y-auto">
              {mockEmployees.map((emp) => (
                <label key={emp.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                  <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{emp.name}</p>
                    <p className="text-xs text-slate-500">{emp.department}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <button className="bg-slate-900 text-white rounded-xl px-6 py-3 font-medium hover:bg-slate-800 flex items-center gap-2">
            <Check className="w-4 h-4" />
            Asignar KPIs
          </button>
        </div>
      )}

      {/* Evaluate Tab */}
      {activeTab === 'evaluate' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Evaluar KPIs de Empleados</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Seleccionar Empleado</label>
            <select className="w-full max-w-md border border-slate-200 rounded-xl px-4 py-2.5">
              <option value="">Seleccionar...</option>
              {mockEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} - {emp.department}</option>
              ))}
            </select>
          </div>

          {/* Example KPI entries */}
          <div className="space-y-4">
            {mockKPITemplates[0].kpis.map((kpi) => (
              <div key={kpi.id} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-slate-900">{kpi.name}</h4>
                    <p className="text-sm text-slate-500">Meta: {kpi.target} {kpi.unit} | Peso: {kpi.weight}%</p>
                  </div>
                  <div className="flex gap-1">
                    <span className="w-4 h-4 rounded-full bg-red-400" />
                    <span className="w-4 h-4 rounded-full bg-yellow-400" />
                    <span className="w-4 h-4 rounded-full bg-green-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Valor alcanzado</label>
                    <input type="number" placeholder={`Ej: ${Math.round(kpi.target * 0.85)}`} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">% Cumplimiento</label>
                    <input type="text" readOnly value="85%" className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-6 bg-slate-900 text-white rounded-xl px-6 py-3 font-medium hover:bg-slate-800 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Guardar Evaluación
          </button>
        </div>
      )}

      {/* Compare Tab */}
      {activeTab === 'compare' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Rendimiento por Equipo</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockDepartments.map(d => ({
                name: d.name.substring(0, 6),
                valor: Math.round(60 + Math.random() * 35)
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="valor" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Evolución Temporal</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { mes: 'Ene', prom: 65 }, { mes: 'Feb', prom: 68 }, { mes: 'Mar', prom: 72 },
                { mes: 'Abr', prom: 70 }, { mes: 'May', prom: 75 }, { mes: 'Jun', prom: 78 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="prom" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Create KPI Modal */}
      {showCreateKPI && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Crear Nuevo KPI</h3>
              <button onClick={() => setShowCreateKPI(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
                <input type="text" placeholder="Ej: Ventas mensuales" className="w-full border border-slate-200 rounded-xl px-4 py-2.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Meta</label>
                  <input type="number" placeholder="100" className="w-full border border-slate-200 rounded-xl px-4 py-2.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Unidad</label>
                  <input type="text" placeholder="$, %, etc" className="w-full border border-slate-200 rounded-xl px-4 py-2.5" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Umbrales</label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-red-50 p-3 rounded-xl">
                    <p className="text-xs text-red-600 mb-1">Rojo {"<"}</p>
                    <input type="number" placeholder="60" className="w-full border border-red-200 rounded-lg px-2 py-1 text-sm" />
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-xl">
                    <p className="text-xs text-yellow-600 mb-1">Amarillo</p>
                    <input type="number" placeholder="80" className="w-full border border-yellow-200 rounded-lg px-2 py-1 text-sm" />
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl">
                    <p className="text-xs text-green-600 mb-1">Verde {">"}</p>
                    <input type="number" placeholder="90" className="w-full border border-green-200 rounded-lg px-2 py-1 text-sm" />
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => { setShowCreateKPI(false); alert('KPI creado (demo)'); }}
              className="w-full bg-slate-900 text-white rounded-xl px-4 py-3 font-medium"
            >
              Guardar KPI
            </button>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && selectedKPITemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Asignar: {selectedKPITemplate.name}</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="max-h-64 overflow-y-auto mb-6">
              {mockEmployees.map((emp) => (
                <label key={emp.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full" />
                  <span className="text-sm">{emp.name}</span>
                </label>
              ))}
            </div>
            
            <button 
              onClick={() => { setShowAssignModal(false); alert('Asignado (demo)'); }}
              className="w-full bg-slate-900 text-white rounded-xl px-4 py-3 font-medium"
            >
              Asignar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// REMAINING COMPONENTS (Dashboard, Employees, Manual Eval, Public Form)
// ============================================

const Dashboard = ({ isAdmin }) => {
  const avgValores = Math.round(mockEmployees.reduce((a, e) => a + e.valoresScore, 0) / mockEmployees.length);
  const avgResultados = Math.round(mockEmployees.reduce((a, e) => a + e.resultadosScore, 0) / mockEmployees.length);
  const topPerformers = mockEmployees.filter(e => getClassification(e.valoresScore, e.resultadosScore).code === "A").length;
  const needsAttention = mockEmployees.filter(e => ["C1", "C2", "C3"].includes(getClassification(e.valoresScore, e.resultadosScore).code)).length;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>Dashboard</h1>
        <p className="text-slate-500 mt-1">Resumen de evaluaciones 360°</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <Users className="w-5 h-5 text-slate-400 mb-2" />
          <p className="text-sm text-slate-500">Empleados</p>
          <p className="text-3xl font-bold text-slate-900">{mockEmployees.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <Award className="w-5 h-5 text-purple-500 mb-2" />
          <p className="text-sm text-slate-500">Prom. Valores</p>
          <p className="text-3xl font-bold text-purple-600">{avgValores}%</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <Star className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-sm text-slate-500">Empleados A</p>
          <p className="text-3xl font-bold text-green-600">{topPerformers}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <AlertTriangle className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-sm text-slate-500">Atención</p>
          <p className="text-3xl font-bold text-red-600">{needsAttention}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Empleado A</h2>
            <NavLink to="/9box" className="text-sm text-blue-600">Ver completo →</NavLink>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["B3", "B2", "A", "C4", "B1", "B4", "C1", "C2", "C3"].map((code) => {
              const config = classificationMatrix[code];
              const colors = classificationColors[config.color];
              const count = mockEmployees.filter(e => getClassification(e.valoresScore, e.resultadosScore).code === code).length;
              return (
                <div key={code} className="rounded-xl border-2 p-3 text-center" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
                  <span className="text-lg font-bold" style={{ color: colors.text }}>{code}</span>
                  <p className="text-xs" style={{ color: colors.text }}>{config.label}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: colors.text }}>{count}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-4">Acciones Rápidas</h2>
          <div className="space-y-2">
            <NavLink to="/evaluations" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Link className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Generar Enlace 360</p>
                <p className="text-xs text-slate-500">Crear evaluación</p>
              </div>
            </NavLink>
            <NavLink to="/kpis" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Evaluar KPIs</p>
                <p className="text-xs text-slate-500">Indicadores</p>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeeList = ({ isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredEmployees = mockEmployees.filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>Empleados</h1>
          <p className="text-slate-500 mt-1">Gestión del personal</p>
        </div>
        <button className="bg-slate-900 text-white rounded-xl px-4 py-2.5 font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar empleado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Empleado</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase px-6 py-4">Valores</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase px-6 py-4">Resultados</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase px-6 py-4">Clasificación</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase px-6 py-4">Evaluadores</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map((emp) => {
              const classification = getClassification(emp.valoresScore, emp.resultadosScore);
              const colors = classificationColors[classification.color];
              const totalEvaluators = Object.values(emp.evaluatorCounts).reduce((a, b) => a + b, 0);
              return (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt="" className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-medium text-slate-900">{emp.name}</p>
                        <p className="text-sm text-slate-500">{emp.position}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-purple-600">{emp.valoresScore}%</td>
                  <td className="px-6 py-4 text-center font-semibold text-blue-600">{emp.resultadosScore}%</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-lg font-bold text-sm" style={{ backgroundColor: colors.bg, color: colors.text }}>
                      {classification.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-600">{totalEvaluators} personas</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ManualEvaluation = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>Evaluación Manual</h1>
        <p className="text-slate-500 mt-1">Asigna directamente un cuadrante del 9-Box</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-amber-700"><AlertTriangle className="w-4 h-4 inline mr-2" />Esta clasificación sobrescribirá el resultado calculado.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-4">1. Seleccionar Empleado</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {mockEmployees.map((emp) => {
              const classification = getClassification(emp.valoresScore, emp.resultadosScore);
              const colors = classificationColors[classification.color];
              return (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left ${selectedEmployee?.id === emp.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200'}`}
                >
                  <img src={emp.avatar} alt="" className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{emp.name}</p>
                    <p className="text-sm text-slate-500">{emp.position}</p>
                  </div>
                  <span className="px-3 py-1 rounded-lg font-bold text-sm" style={{ backgroundColor: colors.bg, color: colors.text }}>{classification.code}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-4">2. Seleccionar Clasificación</h2>
          {selectedEmployee ? (
            <>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {["B3", "B2", "A", "C4", "B1", "B4", "C1", "C2", "C3"].map((code) => {
                  const config = classificationMatrix[code];
                  const colors = classificationColors[config.color];
                  return (
                    <button
                      key={code}
                      onClick={() => setSelectedCode(code)}
                      className={`rounded-xl border-2 p-3 text-center ${selectedCode === code ? 'ring-2 ring-slate-900' : ''}`}
                      style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                    >
                      <span className="text-xl font-bold" style={{ color: colors.text }}>{code}</span>
                      <p className="text-xs mt-1" style={{ color: colors.text }}>{config.label}</p>
                    </button>
                  );
                })}
              </div>
              {selectedCode && (
                <>
                  <textarea rows={3} placeholder="Justificación..." className="w-full border border-slate-200 rounded-xl px-4 py-3 mb-4" />
                  <button className="w-full bg-slate-900 text-white rounded-xl px-4 py-3 font-medium">Aplicar Override</button>
                </>
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
    </div>
  );
};

const PublicEvaluationForm = () => {
  const { token } = useParams();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const template = mockEvaluationTemplates[0];
  const employee = mockEmployees[0];
  const sections = template.sections;
  const currentSec = sections[currentSection];

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">¡Gracias!</h1>
          <p className="text-slate-500">Tu evaluación ha sido registrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <img src={employee.avatar} alt="" className="w-16 h-16 rounded-xl" />
            <div>
              <p className="text-sm text-slate-500">Evaluación 360° para:</p>
              <h2 className="text-xl font-semibold text-slate-900">{employee.name}</h2>
            </div>
          </div>
          <div className="flex gap-2">
            {sections.map((_, idx) => (
              <div key={idx} className={`flex-1 h-2 rounded-full ${idx <= currentSection ? 'bg-slate-900' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">{currentSec?.name}</h3>
          {currentSec?.items.map((item) => (
            <div key={item.id} className="mb-6">
              <p className="text-sm text-slate-700 mb-3">{item.name}</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setAnswers(prev => ({ ...prev, [item.id]: n }))}
                    className={`flex-1 h-12 rounded-xl border-2 font-semibold ${answers[item.id] === n ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-400'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            {currentSection > 0 && <button onClick={() => setCurrentSection(p => p - 1)} className="px-6 py-3 border rounded-xl">Anterior</button>}
            <button
              onClick={() => currentSection === sections.length - 1 ? setSubmitted(true) : setCurrentSection(p => p + 1)}
              className="flex-1 bg-slate-900 text-white rounded-xl px-6 py-3 font-medium"
            >
              {currentSection === sections.length - 1 ? 'Enviar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================

const Layout = ({ children, isAdmin, setIsAdmin }) => (
  <div className="flex min-h-screen bg-[#FAFAFA]">
    <Sidebar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
    <main className="flex-1 p-8 overflow-auto">
      <div className="max-w-6xl mx-auto">{children}</div>
    </main>
  </div>
);

function App() {
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/evaluate/:token" element={<PublicEvaluationForm />} />
        <Route path="*" element={
          <Layout isAdmin={isAdmin} setIsAdmin={setIsAdmin}>
            <Routes>
              <Route path="/" element={<Dashboard isAdmin={isAdmin} />} />
              <Route path="/9box" element={<NineBoxGridView isAdmin={isAdmin} />} />
              <Route path="/employees" element={<EmployeeList isAdmin={isAdmin} />} />
              <Route path="/evaluations" element={<EvaluationsView isAdmin={isAdmin} />} />
              <Route path="/kpis" element={<KPIsView isAdmin={isAdmin} />} />
              <Route path="/my-profile" element={<MyProfileResultsView isAdmin={isAdmin} />} />
              <Route path="/manual-eval" element={<ManualEvaluation />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
