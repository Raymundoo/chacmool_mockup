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
  ArrowRight
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart as RechartsPie, Pie, Cell } from 'recharts';

// ============================================
// CLASSIFICATION SYSTEM - BASED ON CLIENT'S LOGIC
// ============================================

// 9-Box Matrix Structure based on client's document:
// VALORES (Y-axis): 40%, 80%, 100%
// RESULTADOS (X-axis): 40%, 80%, 100%

const classificationMatrix = {
  "A": { 
    valores: { min: 81, max: 100 }, 
    resultados: { min: 81, max: 100 },
    label: "Jugador A", 
    description: "Espectaculares. Da resultados. Independientes. Les das qué hacer y traen los resultados. Aspiran a gerentes o supervisores.",
    color: "green",
    action: "Retener y desarrollar para roles de liderazgo"
  },
  "B2": { 
    valores: { min: 81, max: 100 }, 
    resultados: { min: 61, max: 80 },
    label: "Futuro A", 
    description: "Tiene valores y está cerca de dar resultados completos. Con coaching puede llegar a A.",
    color: "yellow",
    action: "Coaching intensivo en resultados"
  },
  "B3": { 
    valores: { min: 81, max: 100 }, 
    resultados: { min: 0, max: 60 },
    label: "Quiere ser A", 
    description: "Tiene los valores, pero no da resultados. Está en el puesto incorrecto (principalmente problemas de liderazgo). La estrategia de entrenamiento no es correcta.",
    color: "orange",
    action: "Reubicar o ajustar estrategia de entrenamiento"
  },
  "B1": { 
    valores: { min: 61, max: 80 }, 
    resultados: { min: 61, max: 80 },
    label: "Performer Sólido", 
    description: "Tiene valores y da resultados de forma consistente. Pilar del equipo.",
    color: "yellow",
    action: "Desarrollar valores para alcanzar nivel A"
  },
  "B4": { 
    valores: { min: 61, max: 80 }, 
    resultados: { min: 81, max: 100 },
    label: "Alto Potencial", 
    description: "Quieren ser jugadores A. Tiene valores y da resultados. Muy cerca de ser A.",
    color: "yellow-light",
    action: "Reforzar valores para promoción"
  },
  "C4": { 
    valores: { min: 61, max: 80 }, 
    resultados: { min: 0, max: 60 },
    label: "En Desarrollo", 
    description: "Valores aceptables pero resultados bajos. Requiere plan de mejora.",
    color: "orange",
    action: "Plan de mejora con seguimiento cercano"
  },
  "C3": { 
    valores: { min: 0, max: 60 }, 
    resultados: { min: 81, max: 100 },
    label: "Difícil de Sacar", 
    description: "Genera muchos resultados, pero no tiene valores (cáncer). Persona que se cree Dios. Tóxico para el equipo.",
    color: "red",
    action: "Coaching urgente en valores o desvincular"
  },
  "C2": { 
    valores: { min: 0, max: 60 }, 
    resultados: { min: 61, max: 80 },
    label: "Bajo Rendimiento", 
    description: "Esperando a que los corran. Ni valores ni resultados destacables.",
    color: "red-light",
    action: "Plan de mejora o desvincular"
  },
  "C1": { 
    valores: { min: 0, max: 60 }, 
    resultados: { min: 0, max: 60 },
    label: "Acción Urgente", 
    description: "Esperando a que los corran. Sin valores ni resultados.",
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

// Get classification based on scores
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
// MOCK DATA - BASED ON CLIENT'S EVALUATION STRUCTURE
// ============================================

const mockDepartments = [
  { id: "dept-1", name: "Tecnología", color: "#3B82F6" },
  { id: "dept-2", name: "Operaciones", color: "#8B5CF6" },
  { id: "dept-3", name: "Ventas", color: "#10B981" },
  { id: "dept-4", name: "Soporte", color: "#F59E0B" },
  { id: "dept-5", name: "Administración", color: "#EC4899" },
];

// Evaluator types based on client's document
const evaluatorTypes = [
  { id: "superior", name: "Superior", icon: UserCheck, color: "#3B82F6", weight: 30 },
  { id: "subordinados", name: "Subordinados", icon: Users, color: "#8B5CF6", weight: 20 },
  { id: "companeros", name: "Compañeros", icon: Users2, color: "#10B981", weight: 20 },
  { id: "clientes", name: "Clientes", icon: Briefcase, color: "#F59E0B", weight: 15 },
  { id: "autoevaluacion", name: "Autoevaluación", icon: User, color: "#EC4899", weight: 15 },
];

// Competencies based on client's CSV
const competencias = [
  { id: "liderazgo", name: "Liderazgo", description: "Capacidad de guiar e inspirar a otros hacia los objetivos" },
  { id: "trabajo_equipo", name: "Trabajo en equipo", description: "Colaboración efectiva con compañeros" },
  { id: "resolucion_problemas", name: "Resolución de problemas", description: "Capacidad de analizar y resolver situaciones complejas" },
  { id: "aprendizaje_continuo", name: "Aprendizaje continuo", description: "Disposición para adquirir nuevos conocimientos" },
];

// Values based on client's CSV
const valores = [
  { id: "hazlo_ahora", name: "Hazlo Ahora", description: "Actitud proactiva y de acción inmediata" },
  { id: "mejora_continua", name: "Mejora continua (Ley Boy Scout)", description: "Dejar todo mejor de como lo encontraste" },
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
    valoresScore: 92, resultadosScore: 88, // Clasificación: A
    evaluations: { superior: 90, subordinados: 88, companeros: 85, clientes: 80, autoevaluacion: 95 },
    manualOverride: null
  },
  { 
    id: "EMP-002", name: "Juan Rodríguez", position: "Desarrollador Sr", departmentId: "dept-1", department: "Tecnología",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    valoresScore: 85, resultadosScore: 75, // Clasificación: B2
    evaluations: { superior: 82, subordinados: 78, companeros: 80, clientes: 75, autoevaluacion: 88 },
    manualOverride: null
  },
  { 
    id: "EMP-003", name: "Laura Sánchez", position: "Gerente de Operaciones", departmentId: "dept-2", department: "Operaciones",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    valoresScore: 95, resultadosScore: 55, // Clasificación: B3
    evaluations: { superior: 70, subordinados: 92, companeros: 88, clientes: 65, autoevaluacion: 90 },
    manualOverride: null
  },
  { 
    id: "EMP-004", name: "Carlos Mendoza", position: "Ejecutivo de Ventas", departmentId: "dept-3", department: "Ventas",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    valoresScore: 45, resultadosScore: 92, // Clasificación: C3 (Difícil de sacar)
    evaluations: { superior: 85, subordinados: 40, companeros: 35, clientes: 90, autoevaluacion: 75 },
    manualOverride: null
  },
  { 
    id: "EMP-005", name: "Ana Martínez", position: "Coordinadora de Soporte", departmentId: "dept-4", department: "Soporte",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    valoresScore: 72, resultadosScore: 78, // Clasificación: B1
    evaluations: { superior: 75, subordinados: 72, companeros: 78, clientes: 80, autoevaluacion: 70 },
    manualOverride: null
  },
  { 
    id: "EMP-006", name: "Roberto Díaz", position: "Vendedor", departmentId: "dept-3", department: "Ventas",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    valoresScore: 78, resultadosScore: 85, // Clasificación: B4
    evaluations: { superior: 88, subordinados: 70, companeros: 75, clientes: 85, autoevaluacion: 80 },
    manualOverride: null
  },
  { 
    id: "EMP-007", name: "Patricia Luna", position: "Asistente Admin", departmentId: "dept-5", department: "Administración",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    valoresScore: 35, resultadosScore: 42, // Clasificación: C1
    evaluations: { superior: 40, subordinados: 35, companeros: 38, clientes: 45, autoevaluacion: 55 },
    manualOverride: null
  },
  { 
    id: "EMP-008", name: "Fernando Torres", position: "Técnico de Soporte", departmentId: "dept-4", department: "Soporte",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    valoresScore: 50, resultadosScore: 70, // Clasificación: C2
    evaluations: { superior: 65, subordinados: 55, companeros: 60, clientes: 72, autoevaluacion: 68 },
    manualOverride: null
  }
];

// Evaluation templates based on client's structure
const mockEvaluationTemplates = [
  {
    id: "eval-1",
    name: "Evaluación 360° Estándar",
    description: "Evaluación integral de competencias y valores para todos los empleados",
    type: "360",
    isActive: true,
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
      { value: 1, label: "Nunca demuestra esta competencia/valor" },
      { value: 2, label: "Rara vez demuestra esta competencia/valor" },
      { value: 3, label: "A veces demuestra esta competencia/valor" },
      { value: 4, label: "Frecuentemente demuestra esta competencia/valor" },
      { value: 5, label: "Siempre demuestra esta competencia/valor" },
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
          <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Outfit' }}>EvalPro</h1>
            <p className="text-xs text-slate-500">Sistema 360°</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-3 px-3">Menú</p>
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
                {location.pathname === item.path && <ChevronRight className="w-4 h-4 text-slate-400" />}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 text-white">
          <p className="text-xs font-semibold mb-1">Modo Mockup</p>
          <p className="text-xs opacity-70">Vista previa del diseño</p>
        </div>
      </div>
    </aside>
  );
};

// ============================================
// 9-BOX GRID WITH PERCENTAGES - MAIN COMPONENT
// ============================================

const NineBoxGridView = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [evalType, setEvalType] = useState("automatic");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();

  const filteredEmployees = selectedDepartment === "all" 
    ? mockEmployees 
    : mockEmployees.filter(e => e.departmentId === selectedDepartment);

  // Matrix structure with percentage labels
  // Y-axis (VALORES): 0-60%, 61-80%, 81-100%
  // X-axis (RESULTADOS): 0-60%, 61-80%, 81-100%
  const matrixRows = [
    { yLabel: "81-100%", yRange: { min: 81, max: 100 } },
    { yLabel: "61-80%", yRange: { min: 61, max: 80 } },
    { yLabel: "0-60%", yRange: { min: 0, max: 60 } },
  ];
  
  const matrixCols = [
    { xLabel: "0-60%", xRange: { min: 0, max: 60 } },
    { xLabel: "61-80%", xRange: { min: 61, max: 80 } },
    { xLabel: "81-100%", xRange: { min: 81, max: 100 } },
  ];

  const matrixCells = [
    // Row 0 (81-100% valores)
    { row: 0, col: 0, code: "B3", ...classificationMatrix["B3"] },
    { row: 0, col: 1, code: "B2", ...classificationMatrix["B2"] },
    { row: 0, col: 2, code: "A", ...classificationMatrix["A"] },
    // Row 1 (61-80% valores)
    { row: 1, col: 0, code: "C4", ...classificationMatrix["C4"] },
    { row: 1, col: 1, code: "B1", ...classificationMatrix["B1"] },
    { row: 1, col: 2, code: "B4", ...classificationMatrix["B4"] },
    // Row 2 (0-60% valores)
    { row: 2, col: 0, code: "C1", ...classificationMatrix["C1"] },
    { row: 2, col: 1, code: "C2", ...classificationMatrix["C2"] },
    { row: 2, col: 2, code: "C3", ...classificationMatrix["C3"] },
  ];

  const getEmployeesInCell = (cell) => {
    return filteredEmployees.filter(emp => {
      const classification = getClassification(emp.valoresScore, emp.resultadosScore);
      return classification.code === cell.code;
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Matriz 9-Box
          </h1>
          <p className="text-slate-500 mt-1">Clasificación de empleados por Valores y Resultados</p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm"
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
          >
            <option value="automatic">Promedio General</option>
            <option value="superior">Solo Superior</option>
            <option value="autoevaluacion">Autoevaluación</option>
            <option value="companeros">Solo Compañeros</option>
          </select>
        </div>
      </div>

      {/* Legend Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">Interpretación de la Matriz</p>
            <p className="text-sm text-blue-700">
              <strong>Eje Y (Vertical):</strong> VALORES - Comportamientos y actitudes alineados con la cultura.{" "}
              <strong>Eje X (Horizontal):</strong> RESULTADOS - Cumplimiento de metas y productividad.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matrix Grid */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex">
            {/* Y-axis label */}
            <div className="flex flex-col justify-center items-center w-16 mr-2">
              <div className="flex items-center gap-1 mb-2">
                <ArrowUp className="w-4 h-4 text-slate-400" />
              </div>
              <span className="text-xs font-bold text-slate-700 tracking-wider" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                VALORES
              </span>
            </div>
            
            <div className="flex-1">
              {/* Y-axis percentage labels */}
              <div className="flex">
                <div className="w-16" />
                <div className="flex-1">
                  {/* Column headers (X percentages) */}
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {matrixCols.map((col, idx) => (
                      <div key={idx} className="text-center">
                        <span className="text-xs font-semibold text-slate-500">{col.xLabel}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Grid rows */}
                  {matrixRows.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex items-center mb-2">
                      {/* Row label (Y percentage) */}
                      <div className="w-16 text-right pr-2">
                        <span className="text-xs font-semibold text-slate-500">{row.yLabel}</span>
                      </div>
                      
                      {/* Cells */}
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        {matrixCells.filter(c => c.row === rowIdx).map((cell) => {
                          const colors = classificationColors[cell.color];
                          const cellEmployees = getEmployeesInCell(cell);
                          const isHighlighted = selectedEmployee && getClassification(selectedEmployee.valoresScore, selectedEmployee.resultadosScore).code === cell.code;
                          
                          return (
                            <div
                              key={cell.code}
                              className={`rounded-xl border-2 p-3 min-h-[130px] transition-all cursor-pointer hover:scale-[1.02] ${
                                isHighlighted ? 'ring-2 ring-slate-900 ring-offset-2' : ''
                              }`}
                              style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-lg font-bold" style={{ color: colors.text }}>{cell.code}</span>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/60" style={{ color: colors.text }}>
                                  {cellEmployees.length}
                                </span>
                              </div>
                              <p className="text-xs font-medium mb-2" style={{ color: colors.text }}>{cell.label}</p>
                              
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
                                  <p className="text-xs text-center" style={{ color: colors.text }}>+{cellEmployees.length - 3} más</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* X-axis label */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-xs font-bold text-slate-700 tracking-wider">RESULTADOS</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
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
                const classification = getClassification(selectedEmployee.valoresScore, selectedEmployee.resultadosScore);
                const colors = classificationColors[classification.color];
                return (
                  <>
                    <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: colors.bg, border: `2px solid ${colors.border}` }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold" style={{ color: colors.text }}>{classification.code}</span>
                        <span className="text-sm font-medium" style={{ color: colors.text }}>{classification.label}</span>
                      </div>
                      <p className="text-xs" style={{ color: colors.text }}>{classification.description}</p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-3 mb-4">
                      <p className="text-xs font-semibold text-slate-600 mb-1">Acción Recomendada:</p>
                      <p className="text-sm text-slate-700">{classification.action}</p>
                    </div>
                  </>
                );
              })()}

              {/* Scores */}
              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600">Valores</span>
                    <span className="text-sm font-bold text-slate-900">{selectedEmployee.valoresScore}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${selectedEmployee.valoresScore}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600">Resultados</span>
                    <span className="text-sm font-bold text-slate-900">{selectedEmployee.resultadosScore}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${selectedEmployee.resultadosScore}%` }} />
                  </div>
                </div>
              </div>

              {/* Evaluations breakdown */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Por Evaluador</p>
                <div className="space-y-2">
                  {evaluatorTypes.map((type) => (
                    <div key={type.id} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{type.name}</span>
                      <span className="font-semibold">{selectedEmployee.evaluations[type.id]}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-6">
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
                  Override
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Selecciona un empleado de la matriz</p>
            </div>
          )}
        </div>
      </div>

      {/* Classification Legend */}
      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Leyenda de Clasificaciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(classificationMatrix).map(([code, config]) => {
            const colors = classificationColors[config.color];
            return (
              <div key={code} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: colors.bg }}>
                <span className="text-xl font-bold" style={{ color: colors.text }}>{code}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: colors.text }}>{config.label}</p>
                  <p className="text-xs" style={{ color: colors.text }}>{config.description.substring(0, 60)}...</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
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
    const classification = getClassification(emp.valoresScore, emp.resultadosScore);
    classificationCounts[classification.code] = (classificationCounts[classification.code] || 0) + 1;
  });

  const avgValores = Math.round(filteredEmployees.reduce((a, e) => a + e.valoresScore, 0) / filteredEmployees.length);
  const avgResultados = Math.round(filteredEmployees.reduce((a, e) => a + e.resultadosScore, 0) / filteredEmployees.length);
  const topPerformers = filteredEmployees.filter(e => getClassification(e.valoresScore, e.resultadosScore).code === "A").length;
  const needsAttention = filteredEmployees.filter(e => ["C1", "C2", "C3"].includes(getClassification(e.valoresScore, e.resultadosScore).code)).length;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Resumen de evaluaciones 360°</p>
        </div>
        
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm"
        >
          <option value="all">Todos los departamentos</option>
          {mockDepartments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-slate-400" />
            <p className="text-sm text-slate-500">Empleados</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">{filteredEmployees.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-purple-500" />
            <p className="text-sm text-slate-500">Prom. Valores</p>
          </div>
          <p className="text-3xl font-bold text-purple-600">{avgValores}%</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-slate-500">Prom. Resultados</p>
          </div>
          <p className="text-3xl font-bold text-blue-600">{avgResultados}%</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-green-500" />
            <p className="text-sm text-slate-500">Jugadores A</p>
          </div>
          <p className="text-3xl font-bold text-green-600">{topPerformers}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-slate-500">Requieren Atención</p>
          </div>
          <p className="text-3xl font-bold text-red-600">{needsAttention}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mini 9-Box */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Distribución 9-Box</h2>
            <NavLink to="/9box" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Ver detalle <ChevronRight className="w-4 h-4" />
            </NavLink>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {["B3", "B2", "A", "C4", "B1", "B4", "C1", "C2", "C3"].map((code) => {
              const config = classificationMatrix[code];
              const colors = classificationColors[config.color];
              const count = classificationCounts[code] || 0;
              
              return (
                <div
                  key={code}
                  className="rounded-xl border-2 p-3 text-center"
                  style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                >
                  <span className="text-lg font-bold" style={{ color: colors.text }}>{code}</span>
                  <p className="text-xs" style={{ color: colors.text }}>{config.label}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: colors.text }}>{count}</p>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
            <span>← Menos Resultados</span>
            <span className="font-semibold">RESULTADOS</span>
            <span>Más Resultados →</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Acciones Rápidas</h2>
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
            <NavLink to="/manual-eval" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <ClipboardEdit className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Evaluación Manual</p>
                <p className="text-xs text-slate-500">Asignar cuadrante</p>
              </div>
            </NavLink>
            <NavLink to="/results" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Ver Resultados</p>
                <p className="text-xs text-slate-500">Gráficas y reportes</p>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EVALUATIONS VIEW - WITH CLIENT'S STRUCTURE
// ============================================

const EvaluationsView = () => {
  const [templates, setTemplates] = useState(mockEvaluationTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(mockEvaluationTemplates[0]);
  const [editMode, setEditMode] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkConfig, setLinkConfig] = useState({ employeeId: '', evaluatorType: 'superior' });
  const [generatedLink, setGeneratedLink] = useState(null);

  const handleSectionWeightChange = (sectionId, newWeight) => {
    const newWeight_ = Math.max(0, Math.min(100, parseInt(newWeight) || 0));
    const updatedTemplate = {
      ...selectedTemplate,
      sections: autoAdjustWeights(selectedTemplate.sections, sectionId, newWeight_)
    };
    setSelectedTemplate(updatedTemplate);
  };

  const handleItemWeightChange = (sectionId, itemId, newWeight) => {
    const newWeight_ = Math.max(0, Math.min(100, parseInt(newWeight) || 0));
    const updatedTemplate = {
      ...selectedTemplate,
      sections: selectedTemplate.sections.map(sec => {
        if (sec.id !== sectionId) return sec;
        return { ...sec, items: autoAdjustWeights(sec.items, itemId, newWeight_) };
      })
    };
    setSelectedTemplate(updatedTemplate);
  };

  const generateLink = () => {
    const token = Math.random().toString(36).substring(2, 10);
    setGeneratedLink(`${window.location.origin}/evaluate/${token}`);
  };

  const totalSectionWeight = selectedTemplate?.sections?.reduce((sum, s) => sum + s.weight, 0) || 0;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Evaluaciones 360°
          </h1>
          <p className="text-slate-500 mt-1">Gestiona plantillas y genera enlaces de evaluación</p>
        </div>
        <button className="bg-slate-900 text-white rounded-xl px-4 py-2.5 font-medium hover:bg-slate-800 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Plantilla
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white">
          <MessageSquare className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="font-semibold mb-1">Evaluación 360°</h3>
          <p className="text-sm opacity-80">Evalúa competencias y valores desde múltiples perspectivas: superior, subordinados, compañeros, clientes y autoevaluación.</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
          <Sliders className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="font-semibold mb-1">Pesos Automáticos</h3>
          <p className="text-sm opacity-80">Al modificar un peso, los demás se ajustan automáticamente para mantener el 100%.</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
          <Link className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="font-semibold mb-1">Enlaces Públicos</h3>
          <p className="text-sm opacity-80">Genera enlaces únicos por evaluador. Se pueden compartir por WhatsApp o email.</p>
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
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  Eval 360
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${template.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
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
          {selectedTemplate && (
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

              {/* Weight Indicator */}
              <div className={`mb-6 p-4 rounded-xl ${totalSectionWeight === 100 ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${totalSectionWeight === 100 ? 'text-green-700' : 'text-amber-700'}`}>
                    Peso total secciones: {totalSectionWeight}%
                  </span>
                  {totalSectionWeight === 100 ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-amber-600" />}
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${totalSectionWeight === 100 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(totalSectionWeight, 100)}%` }} />
                </div>
              </div>

              {/* Sections */}
              {selectedTemplate.sections?.map((section) => {
                const itemsTotal = section.items.reduce((sum, i) => sum + i.weight, 0);
                return (
                  <div key={section.id} className="border border-slate-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{section.name}</h3>
                        <p className="text-xs text-slate-500">Subtotal items: {itemsTotal}%</p>
                      </div>
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
                          <div className="flex-1">
                            <span className="text-sm text-slate-700">{item.name}</span>
                            {item.description && <p className="text-xs text-slate-400">{item.description}</p>}
                          </div>
                          {editMode ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={item.weight}
                              onChange={(e) => handleItemWeightChange(section.id, item.id, e.target.value)}
                              className="w-14 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded text-xs"
                            />
                          ) : (
                            <span className="text-xs font-medium text-slate-400 ml-2">{item.weight}%</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Scale */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Escala de Calificación (1-5)</h4>
                <div className="grid grid-cols-5 gap-2">
                  {selectedTemplate.scale?.map((s) => (
                    <div key={s.value} className="text-center">
                      <div className="w-10 h-10 mx-auto rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-900">
                        {s.value}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
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
                  className="w-full bg-slate-900 text-white rounded-xl px-4 py-3 font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  Generar Enlace
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-slate-600 mb-4">Enlace generado. Compártelo por WhatsApp o email.</p>
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
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(generatedLink)}`, '_blank')}
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
// KPIs VIEW
// ============================================

const KPIsView = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
          Gestión de KPIs
        </h1>
        <p className="text-slate-500 mt-1">Indicadores clave de desempeño</p>
      </div>

      <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-xl w-fit">
        {[
          { id: 'create', label: 'Crear KPIs', icon: Plus },
          { id: 'fill', label: 'Mis KPIs', icon: ClipboardEdit },
          { id: 'review', label: 'Revisión', icon: CheckCircle2 },
          { id: 'compare', label: 'Comparativa', icon: BarChart2 },
        ].map((tab) => (
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

      {activeTab === 'create' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Definir Nuevo KPI</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
              <input type="text" placeholder="Ej: Ventas mensuales" className="w-full border border-slate-200 rounded-xl px-4 py-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Unidad</label>
              <input type="text" placeholder="Ej: $, %, unidades" className="w-full border border-slate-200 rounded-xl px-4 py-2.5" />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-4">Umbrales de Color</label>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-red-700">Rojo (0-60%)</span>
                </div>
                <input type="number" placeholder="60" className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm font-medium text-yellow-700">Amarillo (61-80%)</span>
                </div>
                <input type="number" placeholder="80" className="w-full border border-yellow-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-green-700">Verde (81-100%)</span>
                </div>
                <input type="number" placeholder="100" className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
          
          <button className="bg-slate-900 text-white rounded-xl px-6 py-3 font-medium hover:bg-slate-800">
            Guardar KPI
          </button>
        </div>
      )}

      {activeTab === 'compare' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Rendimiento por Equipo</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockDepartments.map(d => ({
                name: d.name.substring(0, 6),
                valor: Math.round(mockEmployees.filter(e => e.departmentId === d.id).reduce((a, e) => a + e.resultadosScore, 0) / Math.max(mockEmployees.filter(e => e.departmentId === d.id).length, 1))
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
    </div>
  );
};

// ============================================
// MANUAL EVALUATION
// ============================================

const ManualEvaluation = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
          Evaluación Manual (Override)
        </h1>
        <p className="text-slate-500 mt-1">Asigna directamente un cuadrante del 9-Box</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Override Manual</p>
            <p className="text-sm text-amber-700">Esta clasificación sobrescribirá el resultado calculado. Usa cuando tengas información adicional que justifique un cambio.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Selection */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">1. Seleccionar Empleado</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {mockEmployees.map((emp) => {
              const classification = getClassification(emp.valoresScore, emp.resultadosScore);
              const colors = classificationColors[classification.color];
              
              return (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                    selectedEmployee?.id === emp.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200'
                  }`}
                >
                  <img src={emp.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{emp.name}</p>
                    <p className="text-sm text-slate-500">{emp.position}</p>
                  </div>
                  <span className="px-3 py-1 rounded-lg font-bold text-sm" style={{ backgroundColor: colors.bg, color: colors.text }}>
                    {classification.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Classification Grid */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">2. Seleccionar Clasificación</h2>
          
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
                      className={`rounded-xl border-2 p-3 text-center transition-all ${
                        selectedCode === code ? 'ring-2 ring-slate-900 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                    >
                      <span className="text-xl font-bold" style={{ color: colors.text }}>{code}</span>
                      <p className="text-xs mt-1" style={{ color: colors.text }}>{config.label}</p>
                    </button>
                  );
                })}
              </div>

              {selectedCode && (
                <div className="animate-fade-in">
                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <p className="text-sm"><strong>{selectedEmployee.name}</strong> será clasificado como <strong>{selectedCode}</strong></p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Justificación</label>
                    <textarea rows={3} placeholder="Motivo del override..." className="w-full border border-slate-200 rounded-xl px-4 py-3 resize-none" />
                  </div>
                  <button onClick={() => setShowConfirm(true)} className="w-full bg-slate-900 text-white rounded-xl px-4 py-3 font-medium hover:bg-slate-800">
                    Aplicar Override
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

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">¡Override Aplicado!</h3>
            <p className="text-sm text-slate-500 mb-6">{selectedEmployee?.name} ahora es {selectedCode}</p>
            <button onClick={() => { setShowConfirm(false); setSelectedCode(null); }} className="w-full bg-slate-900 text-white rounded-xl px-4 py-2.5 font-medium">
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// RESULTS VIEW
// ============================================

const ResultsView = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(mockEmployees[0]);

  const radarData = [
    ...competencias.map(c => ({ subject: c.name, score: Math.round(Math.random() * 30 + 60), fullMark: 100 })),
  ];

  const valoresRadarData = valores.map(v => ({ 
    subject: v.name.substring(0, 10), 
    score: Math.round(Math.random() * 30 + 60), 
    fullMark: 100 
  }));

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Resultados de Evaluación
          </h1>
          <p className="text-slate-500 mt-1">Visualización detallada por empleado</p>
        </div>
        
        <select
          value={selectedEmployee?.id || ''}
          onChange={(e) => setSelectedEmployee(mockEmployees.find(emp => emp.id === e.target.value))}
          className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm"
        >
          {mockEmployees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
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
            const classification = getClassification(selectedEmployee.valoresScore, selectedEmployee.resultadosScore);
            const colors = classificationColors[classification.color];
            return (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl text-3xl font-bold" style={{ backgroundColor: colors.bg, color: colors.text, border: `2px solid ${colors.border}` }}>
                  {classification.code}
                </div>
                <p className="text-sm text-slate-500 mt-2">{classification.label}</p>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competencias Radar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Competencias</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Valores Radar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Valores</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={valoresRadarData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Evaluator Breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Desglose por Evaluador</h2>
          <div className="grid grid-cols-5 gap-4">
            {evaluatorTypes.map((type) => (
              <div key={type.id} className="bg-slate-50 rounded-xl p-4 text-center">
                <type.icon className="w-8 h-8 mx-auto mb-2" style={{ color: type.color }} />
                <p className="text-sm text-slate-500 mb-1">{type.name}</p>
                <p className="text-3xl font-bold" style={{ color: type.color }}>{selectedEmployee?.evaluations[type.id]}%</p>
                <p className="text-xs text-slate-400 mt-1">Peso: {type.weight}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EMPLOYEES LIST
// ============================================

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === "all" || emp.departmentId === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>Empleados</h1>
          <p className="text-slate-500 mt-1">Gestión del personal</p>
        </div>
        <button className="bg-slate-900 text-white rounded-xl px-4 py-2.5 font-medium hover:bg-slate-800 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
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
            <option value="all">Todos</option>
            {mockDepartments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Empleado</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Dept.</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase px-6 py-4">Valores</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase px-6 py-4">Resultados</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase px-6 py-4">Clasificación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map((emp) => {
              const classification = getClassification(emp.valoresScore, emp.resultadosScore);
              const colors = classificationColors[classification.color];
              
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
                  <td className="px-6 py-4 text-sm text-slate-600">{emp.department}</td>
                  <td className="px-6 py-4 text-center font-semibold text-purple-600">{emp.valoresScore}%</td>
                  <td className="px-6 py-4 text-center font-semibold text-blue-600">{emp.resultadosScore}%</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-lg font-bold text-sm" style={{ backgroundColor: colors.bg, color: colors.text }}>
                      {classification.code}
                    </span>
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
// PUBLIC EVALUATION FORM
// ============================================

const PublicEvaluationForm = () => {
  const { token } = useParams();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const template = mockEvaluationTemplates[0];
  const employee = mockEmployees[0];
  const sections = template.sections;
  const currentSec = sections[currentSection];
  const isLastSection = currentSection === sections.length - 1;

  const handleAnswer = (itemId, value) => {
    setAnswers(prev => ({ ...prev, [itemId]: value }));
  };

  const sectionAnswered = currentSec?.items.every(item => answers[item.id]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">¡Gracias por tu evaluación!</h1>
          <p className="text-slate-500 mb-6">Tu feedback ha sido registrado y ayudará en el desarrollo de {employee.name}.</p>
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
              <p className="text-sm text-slate-500">Evaluación 360° para:</p>
              <h2 className="text-xl font-semibold text-slate-900">{employee.name}</h2>
              <p className="text-sm text-slate-500">{employee.position}</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="flex gap-2 mb-2">
            {sections.map((_, idx) => (
              <div key={idx} className={`flex-1 h-2 rounded-full ${idx < currentSection ? 'bg-green-500' : idx === currentSection ? 'bg-slate-900' : 'bg-slate-200'}`} />
            ))}
          </div>
          <p className="text-sm text-slate-500">Sección {currentSection + 1} de {sections.length}: <strong>{currentSec?.name}</strong></p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="space-y-6">
            {currentSec?.items.map((item) => (
              <div key={item.id}>
                <p className="text-slate-700 font-medium mb-2">{item.name}</p>
                {item.description && <p className="text-sm text-slate-500 mb-3">{item.description}</p>}
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleAnswer(item.id, val)}
                      className={`flex-1 h-12 rounded-xl border-2 font-semibold transition-all ${
                        answers[item.id] === val ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      {val}
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

          <div className="flex gap-3 mt-8">
            {currentSection > 0 && (
              <button onClick={() => setCurrentSection(prev => prev - 1)} className="px-6 py-3 border border-slate-200 rounded-xl font-medium">
                Anterior
              </button>
            )}
            <button
              onClick={() => isLastSection ? setSubmitted(true) : setCurrentSection(prev => prev + 1)}
              disabled={!sectionAnswered}
              className="flex-1 bg-slate-900 text-white rounded-xl px-6 py-3 font-medium disabled:opacity-50"
            >
              {isLastSection ? 'Enviar Evaluación' : 'Siguiente'}
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
        <Route path="/evaluate/:token" element={<PublicEvaluationForm />} />
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
