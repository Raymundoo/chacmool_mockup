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
// Evaluator types for 360 evaluations
const evaluatorTypes360 = [
  { id: 'lider', name: 'Líder', icon: Shield, color: '#8B5CF6', description: 'Jefe, supervisor o manager' },
  { id: 'igual', name: 'Compañeros', icon: Users2, color: '#3B82F6', description: 'Pares o colegas del mismo nivel' },
  { id: 'subordinado', name: 'Subordinados', icon: User, color: '#10B981', description: 'Colaboradores a cargo' },
  { id: 'cliente', name: 'Cliente', icon: Briefcase, color: '#F59E0B', description: 'Clientes internos/externos' },
  { id: 'autoevaluacion', name: 'Autoevaluación', icon: UserCheck, color: '#EC4899', description: 'El mismo empleado' }
];

const mockEval360Templates = [
  {
    id: "eval-1",
    name: "Evaluación 360° Estándar",
    description: "Evaluación integral de competencias y valores. Se evalúa liderazgo, trabajo en equipo, comunicación y orientación a resultados.",
    generalDescription: "Esta evaluación mide las competencias clave para el éxito en la organización. Cada competencia se califica en una escala del 1 al 5, donde 1 es el nivel más bajo y 5 el más alto. Los resultados se promedian por tipo de evaluador para obtener una visión 360° completa.",
    isActive: true,
    assignedPositions: ["Todos"],
    competencies: [
      {
        id: "comp-1",
        title: "Trabajo en Equipo",
        behavior: "Colabora y participa activamente con los demás para alcanzar metas comunes",
        description: "Evalúa la capacidad del colaborador para trabajar efectivamente con otros y contribuir al logro de objetivos compartidos.",
        responses: [
          { value: 1, label: "Nunca colabora", description: "Nunca colabora ni apoya al equipo" },
          { value: 2, label: "Colabora poco", description: "Colabora poco y solo cuando se le pide" },
          { value: 3, label: "Colabora regularmente", description: "Colabora de forma regular según expectativas" },
          { value: 4, label: "Colabora frecuentemente", description: "Colabora frecuentemente y motiva a otros" },
          { value: 5, label: "Colabora siempre", description: "Siempre colabora y lidera iniciativas de equipo" }
        ]
      },
      {
        id: "comp-2",
        title: "Comunicación",
        behavior: "Se comunica de manera clara, efectiva y respetuosa",
        description: "Mide la habilidad para transmitir ideas y mantener comunicación constructiva.",
        responses: [
          { value: 1, label: "No se comunica", description: "No se comunica o lo hace de manera confusa" },
          { value: 2, label: "Comunica poco", description: "Se comunica poco y con dificultad" },
          { value: 3, label: "Comunica adecuadamente", description: "Se comunica adecuadamente la mayoría del tiempo" },
          { value: 4, label: "Comunica muy bien", description: "Se comunica muy bien, claro y escucha activamente" },
          { value: 5, label: "Comunicación excepcional", description: "Comunicación excepcional, facilita diálogos" }
        ]
      },
      {
        id: "comp-3",
        title: "Orientación a Resultados",
        behavior: "Cumple metas y busca mejorar su desempeño",
        description: "",
        responses: [
          { value: 1, label: "No cumple", description: "Raramente cumple metas establecidas" },
          { value: 2, label: "Cumple parcialmente", description: "Cumple parcialmente con las metas" },
          { value: 3, label: "Cumple metas", description: "Cumple con las metas establecidas" },
          { value: 4, label: "Supera metas", description: "Frecuentemente supera las metas" },
          { value: 5, label: "Siempre supera", description: "Siempre supera metas y busca excelencia" }
        ]
      },
      {
        id: "comp-4",
        title: "Liderazgo",
        behavior: "Inspira, guía y desarrolla a otros",
        description: "Evalúa capacidad para influir positivamente y empoderar al equipo.",
        responses: [
          { value: 1, label: "No lidera", description: "No demuestra capacidad de liderazgo" },
          { value: 2, label: "Lidera ocasionalmente", description: "Lidera ocasionalmente pero le falta confianza" },
          { value: 3, label: "Liderazgo adecuado", description: "Demuestra liderazgo cuando es necesario" },
          { value: 4, label: "Buen líder", description: "Buen líder, inspira y motiva al equipo" },
          { value: 5, label: "Líder excepcional", description: "Líder excepcional, desarrolla talento" }
        ]
      }
    ]
  },
  {
    id: "eval-2",
    name: "Evaluación Técnica",
    description: "Para posiciones técnicas. Evalúa conocimientos técnicos, resolución de problemas y aprendizaje.",
    generalDescription: "Evaluación enfocada en competencias técnicas. Se mide dominio de herramientas, capacidad de resolución de problemas y aprendizaje continuo.",
    isActive: true,
    assignedPositions: ["Desarrollador", "Tech Lead", "Técnico"],
    competencies: [
      {
        id: "comp-tech-1",
        title: "Conocimiento Técnico",
        behavior: "Domina las herramientas necesarias para su rol",
        description: "",
        responses: [
          { value: 1, label: "Básico", description: "Conocimiento muy básico" },
          { value: 2, label: "Limitado", description: "Conocimiento limitado, necesita supervisión" },
          { value: 3, label: "Adecuado", description: "Conocimiento adecuado para su nivel" },
          { value: 4, label: "Avanzado", description: "Conocimiento avanzado, resuelve problemas complejos" },
          { value: 5, label: "Experto", description: "Experto, es referente técnico" }
        ]
      },
      {
        id: "comp-tech-2",
        title: "Resolución de Problemas",
        behavior: "Analiza situaciones y propone soluciones efectivas",
        description: "",
        responses: [
          { value: 1, label: "No resuelve", description: "No resuelve problemas autónomamente" },
          { value: 2, label: "Simples", description: "Resuelve solo problemas simples" },
          { value: 3, label: "Adecuado", description: "Resuelve problemas de complejidad media" },
          { value: 4, label: "Muy bien", description: "Resuelve muy bien problemas complejos" },
          { value: 5, label: "Excepcional", description: "Resuelve excepcionalmente problemas complejos" }
        ]
      }
    ]
  }
];

const mockEvaluationPlans = [
  {
    id: "plan-1",
    employeeId: "1",
    employeeName: "María García López",
    templateId: "eval-1",
    templateName: "Evaluación 360° Estándar",
    period: "Q1 2024",
    createdDate: "2024-01-15",
    dueDate: "2024-03-31",
    evaluators: [
      { id: "ev-1", type: "lider", name: "Director Operaciones", email: "director@empresa.com", status: "completado", link: "eval/abc123", completedDate: "2024-02-10" },
      { id: "ev-2", type: "igual", name: "Juan Rodríguez", email: "juan@empresa.com", status: "completado", link: "eval/def456", completedDate: "2024-02-12" },
      { id: "ev-3", type: "igual", name: "Laura Sánchez", email: "laura@empresa.com", status: "enviado", link: "eval/ghi789", completedDate: null },
      { id: "ev-4", type: "subordinado", name: "Carlos Mendoza", email: "carlos@empresa.com", status: "completado", link: "eval/jkl012", completedDate: "2024-02-15" },
      { id: "ev-5", type: "subordinado", name: "Ana Martínez", email: "ana@empresa.com", status: "pendiente", link: "eval/mno345", completedDate: null },
      { id: "ev-6", type: "cliente", name: "Cliente Corp A", email: "cliente@corp.com", status: "completado", link: "eval/pqr678", completedDate: "2024-02-20" },
      { id: "ev-7", type: "autoevaluacion", name: "María García López", email: "maria@empresa.com", status: "completado", link: "eval/stu901", completedDate: "2024-02-08" }
    ]
  },
  {
    id: "plan-2",
    employeeId: "2",
    employeeName: "Juan Rodríguez",
    templateId: "eval-2",
    templateName: "Evaluación Técnica",
    period: "Q1 2024",
    createdDate: "2024-01-15",
    dueDate: "2024-03-31",
    evaluators: [
      { id: "ev-8", type: "lider", name: "Tech Lead Senior", email: "techlead@empresa.com", status: "completado", link: "eval/vwx234", completedDate: "2024-02-11" },
      { id: "ev-9", type: "igual", name: "María García López", email: "maria@empresa.com", status: "enviado", link: "eval/yza567", completedDate: null },
      { id: "ev-10", type: "subordinado", name: "Pedro García", email: "pedro@empresa.com", status: "pendiente", link: "eval/bcd890", completedDate: null },
      { id: "ev-11", type: "autoevaluacion", name: "Juan Rodríguez", email: "juan@empresa.com", status: "completado", link: "eval/efg123", completedDate: "2024-02-09" }
    ]
  }
];

const mockEvaluationResults = [
  {
    planId: "plan-1",
    employeeId: "1",
    employeeName: "María García López",
    results: {
      "comp-1": {
        responses: [
          { evaluatorId: "ev-1", type: "lider", score: 5 },
          { evaluatorId: "ev-2", type: "igual", score: 4 },
          { evaluatorId: "ev-4", type: "subordinado", score: 5 },
          { evaluatorId: "ev-6", type: "cliente", score: 4 },
          { evaluatorId: "ev-7", type: "autoevaluacion", score: 4 }
        ],
        average: 4.4,
        mostCommon: 4
      },
      "comp-2": {
        responses: [
          { evaluatorId: "ev-1", type: "lider", score: 5 },
          { evaluatorId: "ev-2", type: "igual", score: 5 },
          { evaluatorId: "ev-4", type: "subordinado", score: 4 },
          { evaluatorId: "ev-6", type: "cliente", score: 5 },
          { evaluatorId: "ev-7", type: "autoevaluacion", score: 4 }
        ],
        average: 4.6,
        mostCommon: 5
      },
      "comp-3": {
        responses: [
          { evaluatorId: "ev-1", type: "lider", score: 4 },
          { evaluatorId: "ev-2", type: "igual", score: 4 },
          { evaluatorId: "ev-4", type: "subordinado", score: 5 },
          { evaluatorId: "ev-6", type: "cliente", score: 4 },
          { evaluatorId: "ev-7", type: "autoevaluacion", score: 5 }
        ],
        average: 4.4,
        mostCommon: 4
      },
      "comp-4": {
        responses: [
          { evaluatorId: "ev-1", type: "lider", score: 5 },
          { evaluatorId: "ev-2", type: "igual", score: 4 },
          { evaluatorId: "ev-4", type: "subordinado", score: 5 },
          { evaluatorId: "ev-6", type: "cliente", score: 4 },
          { evaluatorId: "ev-7", type: "autoevaluacion", score: 4 }
        ],
        average: 4.4,
        mostCommon: 4
      }
    }
  }
];

const mockPDIs = [
  {
    id: "pdi-1",
    employeeId: "1",
    employeeName: "María García López",
    department: "Tecnología",
    leader: "Director Operaciones",
    reviewer: "CEO",
    period: "Q1 2024",
    quarters: [
      {
        quarter: "Q1 2024",
        meta: "Mejorar habilidades de liderazgo técnico y mentoría del equipo junior",
        realidad: "Lidero equipo de 4 desarrolladores junior. Me falta experiencia en delegar tareas complejas y dar feedback regular.",
        aprendizajeFormal: "Curso online 'Leadership for Tech Managers' en Coursera (8 semanas)",
        aprendizajeSocial: "Mentoring mensual con CTO para casos de liderazgo",
        aprendizajeAplicado: "Implementar reuniones 1-1 semanales con equipo",
        voluntad: "3 horas semanales al curso, reuniones 1-1 sin falta, 2 técnicas nuevas de feedback/mes",
        evaluaciones: "Evaluación 360° trimestral + feedback equipo + retención"
      }
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
    { path: "/9box", icon: Grid3X3, label: "Empleado A", description: "Empleados A, B, C" },
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

// ============================================
// EVALUATIONS 360 MODULE - REDESIGNED
// ============================================

const EvaluationsView = ({ isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState('design');
  
  // Extract view from URL if present
  useState(() => {
    const path = location.pathname.split('/');
    if (path[2]) setActiveView(path[2]);
  }, [location]);

  const views = [
    { id: 'design', label: 'Diseño', icon: FileText, description: 'Crear plantillas' },
    { id: 'planning', label: 'Planificación', icon: UserPlus, description: 'Asignar evaluadores' },
    { id: 'stats', label: 'Estadísticas', icon: BarChart2, description: 'Resultados agregados' },
    { id: 'tracking', label: 'Tracking', icon: Activity, description: 'Estado evaluaciones' },
    { id: 'pdi', label: 'Resultados y PDI', icon: Award, description: 'Vista 1-1 y PDI' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Evaluaciones 360°
          </h1>
          <p className="text-slate-500 mt-1">Sistema completo de evaluaciones</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-xl w-full overflow-x-auto">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeView === view.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <view.icon className="w-4 h-4" />
            <span>{view.label}</span>
          </button>
        ))}
      </div>

      {/* View Content */}
      {activeView === 'design' && <EvalDesignView isAdmin={isAdmin} />}
      {activeView === 'planning' && <EvalPlanningView isAdmin={isAdmin} />}
      {activeView === 'stats' && <EvalStatsView isAdmin={isAdmin} />}
      {activeView === 'tracking' && <EvalTrackingView isAdmin={isAdmin} />}
      {activeView === 'pdi' && <EvalResultsPDIView isAdmin={isAdmin} />}
    </div>
  );
};

// Vista 1: Diseño de Evaluaciones
const EvalDesignView = ({ isAdmin }) => {
  const [templates, setTemplates] = useState(mockEval360Templates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    generalDescription: '',
    competencies: []
  });

  const addCompetency = () => {
    setNewTemplate(prev => ({
      ...prev,
      competencies: [...prev.competencies, {
        id: `comp-${Date.now()}`,
        title: '',
        behavior: '',
        description: '',
        responses: [
          { value: 1, label: '', description: '' },
          { value: 2, label: '', description: '' },
          { value: 3, label: '', description: '' },
          { value: 4, label: '', description: '' },
          { value: 5, label: '', description: '' }
        ]
      }]
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Templates List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase">Plantillas ({templates.length})</h2>
          <button 
            onClick={() => { setIsCreating(true); setNewTemplate({ name: '', description: '', generalDescription: '', competencies: [] }); }}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Nueva
          </button>
        </div>
        
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => { setSelectedTemplate(template); setIsCreating(false); setIsEditing(false); }}
            className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all ${
              selectedTemplate?.id === template.id ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${template.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {template.isActive ? 'Activa' : 'Inactiva'}
              </span>
              <span className="text-xs text-slate-400">{template.competencies?.length || 0} competencias</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
            <p className="text-sm text-slate-500 line-clamp-2">{template.description}</p>
          </div>
        ))}
      </div>

      {/* Template Detail/Editor */}
      <div className="lg:col-span-2">
        {isCreating || isEditing ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">{isCreating ? 'Crear Nueva Plantilla' : 'Editar Plantilla'}</h2>
              <button onClick={() => { setIsCreating(false); setIsEditing(false); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nombre de la plantilla *</label>
                <input 
                  type="text"
                  placeholder="Ej: Evaluación 360° Gerentes 2024"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Descripción breve *</label>
                <textarea 
                  rows={2}
                  placeholder="Descripción de la evaluación..."
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Descripción general (cómo se evalúa, cómo se califica)</label>
                <textarea 
                  rows={3}
                  placeholder="Explica el propósito de la evaluación, cómo se califica, qué escala se usa..."
                  value={newTemplate.generalDescription}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, generalDescription: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 resize-none"
                />
              </div>

              {/* Competencies */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-700">Competencias</h3>
                  <button 
                    onClick={addCompetency}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Agregar competencia
                  </button>
                </div>

                {newTemplate.competencies.length === 0 && (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Agrega competencias a evaluar</p>
                  </div>
                )}

                {newTemplate.competencies.map((comp, idx) => (
                  <div key={comp.id} className="border border-slate-200 rounded-xl p-4 mb-4 bg-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-700">Competencia {idx + 1}</h4>
                      <button 
                        onClick={() => setNewTemplate(prev => ({ ...prev, competencies: prev.competencies.filter(c => c.id !== comp.id) }))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <input 
                        type="text"
                        placeholder="Título de la competencia (ej: Trabajo en Equipo)"
                        value={comp.title}
                        onChange={(e) => {
                          const updated = [...newTemplate.competencies];
                          updated[idx].title = e.target.value;
                          setNewTemplate(prev => ({ ...prev, competencies: updated }));
                        }}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                      />

                      <input 
                        type="text"
                        placeholder="Comportamiento (ej: Colabora y participa activamente...)"
                        value={comp.behavior}
                        onChange={(e) => {
                          const updated = [...newTemplate.competencies];
                          updated[idx].behavior = e.target.value;
                          setNewTemplate(prev => ({ ...prev, competencies: updated }));
                        }}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                      />

                      <textarea 
                        rows={2}
                        placeholder="Descripción de la competencia (opcional)"
                        value={comp.description}
                        onChange={(e) => {
                          const updated = [...newTemplate.competencies];
                          updated[idx].description = e.target.value;
                          setNewTemplate(prev => ({ ...prev, competencies: updated }));
                        }}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white resize-none"
                      />

                      <div className="mt-3">
                        <p className="text-xs font-semibold text-slate-600 mb-2">Escala de respuestas (1-5)</p>
                        {comp.responses.map((resp, respIdx) => (
                          <div key={respIdx} className="flex gap-2 mb-2 items-start">
                            <span className="w-6 h-6 flex items-center justify-center bg-slate-200 rounded text-xs font-bold text-slate-700 mt-1">
                              {resp.value}
                            </span>
                            <div className="flex-1 space-y-1">
                              <input 
                                type="text"
                                placeholder={`Etiqueta nivel ${resp.value}`}
                                value={resp.label}
                                onChange={(e) => {
                                  const updated = [...newTemplate.competencies];
                                  updated[idx].responses[respIdx].label = e.target.value;
                                  setNewTemplate(prev => ({ ...prev, competencies: updated }));
                                }}
                                className="w-full border border-slate-200 rounded px-2 py-1 text-xs bg-white"
                              />
                              <input 
                                type="text"
                                placeholder={`Descripción nivel ${resp.value}`}
                                value={resp.description}
                                onChange={(e) => {
                                  const updated = [...newTemplate.competencies];
                                  updated[idx].responses[respIdx].description = e.target.value;
                                  setNewTemplate(prev => ({ ...prev, competencies: updated }));
                                }}
                                className="w-full border border-slate-200 rounded px-2 py-1 text-xs bg-white"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => { setIsCreating(false); setIsEditing(false); }}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => { alert('Plantilla guardada (demo)'); setIsCreating(false); setIsEditing(false); }}
                  className="flex-1 bg-slate-900 text-white rounded-xl px-4 py-3 font-medium hover:bg-slate-800 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Guardar Plantilla
                </button>
              </div>
            </div>
          </div>
        ) : selectedTemplate ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{selectedTemplate.name}</h2>
                <p className="text-sm text-slate-500">{selectedTemplate.description}</p>
              </div>
              <button
                onClick={() => { setIsEditing(true); setNewTemplate(selectedTemplate); }}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Editar
              </button>
            </div>

            {selectedTemplate.generalDescription && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-xs font-semibold text-blue-700 mb-1">DESCRIPCIÓN GENERAL</p>
                <p className="text-sm text-blue-800">{selectedTemplate.generalDescription}</p>
              </div>
            )}

            <div className="space-y-4">
              {selectedTemplate.competencies.map((comp, idx) => (
                <div key={comp.id} className="border border-slate-200 rounded-xl p-4">
                  <div className="mb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{comp.title}</h3>
                        <p className="text-sm text-slate-600 italic mb-2">{comp.behavior}</p>
                        {comp.description && <p className="text-xs text-slate-500">{comp.description}</p>}
                      </div>
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">#{idx + 1}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pl-4 border-l-2 border-slate-100">
                    {comp.responses.map((resp) => (
                      <div key={resp.value} className="flex gap-3">
                        <span className="w-6 h-6 flex items-center justify-center bg-slate-200 rounded text-xs font-bold text-slate-700">
                          {resp.value}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{resp.label}</p>
                          <p className="text-xs text-slate-500">{resp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">Selecciona una plantilla o crea una nueva</p>
            <button 
              onClick={() => setIsCreating(true)}
              className="bg-slate-900 text-white rounded-xl px-4 py-2.5 font-medium hover:bg-slate-800 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Plantilla
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Vista 2: Planificación de Evaluaciones
const EvalPlanningView = ({ isAdmin }) => {
  const [plans, setPlans] = useState(mockEvaluationPlans);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    employeeId: '',
    templateId: '',
    period: 'Q1 2024',
    evaluators: []
  });
  const [showAddEvaluator, setShowAddEvaluator] = useState(false);
  const [newEvaluator, setNewEvaluator] = useState({ type: 'lider', name: '', email: '' });

  const addEvaluatorToPlan = () => {
    const evaluator = {
      id: `ev-${Date.now()}`,
      ...newEvaluator,
      status: 'pendiente',
      link: `eval/${Math.random().toString(36).substring(7)}`,
      completedDate: null
    };
    setNewPlan(prev => ({ ...prev, evaluators: [...prev.evaluators, evaluator] }));
    setNewEvaluator({ type: 'lider', name: '', email: '' });
    setShowAddEvaluator(false);
  };

  const simulateEmail = (evaluator) => {
    alert(`Email simulado enviado a: ${evaluator.email}\nAsunto: Evaluación 360°\nLink: ${window.location.origin}/${evaluator.link}`);
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(`${window.location.origin}/${link}`);
    alert('Link copiado al portapapeles');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Plans List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase">Planes ({plans.length})</h2>
          <button 
            onClick={() => setShowCreatePlan(true)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Nuevo Plan
          </button>
        </div>

        {plans.map((plan) => {
          const completed = plan.evaluators.filter(e => e.status === 'completado').length;
          const total = plan.evaluators.length;
          const progress = (completed / total) * 100;
          
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all ${
                selectedPlan?.id === plan.id ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <h3 className="font-semibold text-slate-900 mb-1">{plan.employeeName}</h3>
              <p className="text-xs text-slate-500 mb-2">{plan.templateName} · {plan.period}</p>
              <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                <Users className="w-3 h-3" />
                <span>{completed}/{total} completadas</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Plan Detail */}
      <div className="lg:col-span-2">
        {showCreatePlan ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Crear Plan de Evaluación</h2>
              <button onClick={() => setShowCreatePlan(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Empleado a evaluar *</label>
                <select 
                  value={newPlan.employeeId}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5"
                >
                  <option value="">Seleccionar empleado...</option>
                  {mockEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} - {emp.position}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Plantilla de evaluación *</label>
                <select 
                  value={newPlan.templateId}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, templateId: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5"
                >
                  <option value="">Seleccionar plantilla...</option>
                  {mockEval360Templates.map(tmpl => (
                    <option key={tmpl.id} value={tmpl.id}>{tmpl.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Período *</label>
                <select 
                  value={newPlan.period}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, period: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5"
                >
                  <option value="Q1 2024">Q1 2024</option>
                  <option value="Q2 2024">Q2 2024</option>
                  <option value="Q3 2024">Q3 2024</option>
                  <option value="Q4 2024">Q4 2024</option>
                </select>
              </div>

              {/* Evaluators */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-700">Evaluadores Asignados ({newPlan.evaluators.length})</h3>
                  <button 
                    onClick={() => setShowAddEvaluator(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Agregar evaluador
                  </button>
                </div>

                {newPlan.evaluators.length === 0 && (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Agrega evaluadores para este empleado</p>
                  </div>
                )}

                {newPlan.evaluators.map((ev) => {
                  const evType = evaluatorTypes360.find(t => t.id === ev.type);
                  return (
                    <div key={ev.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${evType.color}20` }}>
                          {evType.id === 'lider' && <Shield className="w-4 h-4" style={{ color: evType.color }} />}
                          {evType.id === 'igual' && <Users2 className="w-4 h-4" style={{ color: evType.color }} />}
                          {evType.id === 'subordinado' && <User className="w-4 h-4" style={{ color: evType.color }} />}
                          {evType.id === 'cliente' && <Briefcase className="w-4 h-4" style={{ color: evType.color }} />}
                          {evType.id === 'autoevaluacion' && <UserCheck className="w-4 h-4" style={{ color: evType.color }} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{ev.name}</p>
                          <p className="text-xs text-slate-500">{evType.name} · {ev.email}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setNewPlan(prev => ({ ...prev, evaluators: prev.evaluators.filter(e => e.id !== ev.id) }))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}

                {showAddEvaluator && (
                  <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-4 mb-2">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Tipo de evaluador</label>
                        <div className="grid grid-cols-2 gap-2">
                          {evaluatorTypes360.map((type) => (
                            <button
                              key={type.id}
                              onClick={() => setNewEvaluator(prev => ({ ...prev, type: type.id }))}
                              className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all text-left ${
                                newEvaluator.type === type.id ? 'border-slate-900 bg-white' : 'border-slate-200 bg-white/50'
                              }`}
                            >
                              {type.id === 'lider' && <Shield className="w-4 h-4" style={{ color: type.color }} />}
                              {type.id === 'igual' && <Users2 className="w-4 h-4" style={{ color: type.color }} />}
                              {type.id === 'subordinado' && <User className="w-4 h-4" style={{ color: type.color }} />}
                              {type.id === 'cliente' && <Briefcase className="w-4 h-4" style={{ color: type.color }} />}
                              {type.id === 'autoevaluacion' && <UserCheck className="w-4 h-4" style={{ color: type.color }} />}
                              <span className="text-xs font-medium">{type.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <input 
                        type="text"
                        placeholder="Nombre del evaluador"
                        value={newEvaluator.name}
                        onChange={(e) => setNewEvaluator(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                      />

                      <input 
                        type="email"
                        placeholder="Email del evaluador"
                        value={newEvaluator.email}
                        onChange={(e) => setNewEvaluator(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={() => { setShowAddEvaluator(false); setNewEvaluator({ type: 'lider', name: '', email: '' }); }}
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-white"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={addEvaluatorToPlan}
                          disabled={!newEvaluator.name || !newEvaluator.email}
                          className="flex-1 bg-slate-900 text-white rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-50"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => setShowCreatePlan(false)}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => { alert('Plan creado (demo)'); setShowCreatePlan(false); }}
                className="flex-1 bg-slate-900 text-white rounded-xl px-4 py-3 font-medium hover:bg-slate-800"
              >
                Crear Plan
              </button>
            </div>
          </div>
        ) : selectedPlan ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">{selectedPlan.employeeName}</h2>
              <p className="text-sm text-slate-500">{selectedPlan.templateName} · {selectedPlan.period}</p>
            </div>

            <div className="space-y-3">
              {selectedPlan.evaluators.map((ev) => {
                const evType = evaluatorTypes360.find(t => t.id === ev.type);
                const statusColors = {
                  pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
                  enviado: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
                  completado: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' }
                };
                const statusColor = statusColors[ev.status];

                return (
                  <div key={ev.id} className={`border-2 ${statusColor.border} rounded-xl p-4`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${evType.color}20` }}>
                          {evType.id === 'lider' && <Shield className="w-5 h-5" style={{ color: evType.color }} />}
                          {evType.id === 'igual' && <Users2 className="w-5 h-5" style={{ color: evType.color }} />}
                          {evType.id === 'subordinado' && <User className="w-5 h-5" style={{ color: evType.color }} />}
                          {evType.id === 'cliente' && <Briefcase className="w-5 h-5" style={{ color: evType.color }} />}
                          {evType.id === 'autoevaluacion' && <UserCheck className="w-5 h-5" style={{ color: evType.color }} />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{ev.name}</p>
                          <p className="text-xs text-slate-500">{evType.name}</p>
                          <p className="text-xs text-slate-400">{ev.email}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor.bg} ${statusColor.text}`}>
                        {ev.status === 'pendiente' && '🟡 Pendiente'}
                        {ev.status === 'enviado' && '🔵 Enviado'}
                        {ev.status === 'completado' && '🟢 Completado'}
                      </span>
                    </div>

                    {ev.status !== 'completado' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyLink(ev.link)}
                          className="flex-1 bg-slate-100 text-slate-700 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-200 flex items-center justify-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copiar Link
                        </button>
                        <button
                          onClick={() => simulateEmail(ev)}
                          className="flex-1 bg-blue-600 text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Enviar Email
                        </button>
                      </div>
                    )}

                    {ev.status === 'completado' && ev.completedDate && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Completado el {ev.completedDate}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <UserPlus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">Selecciona un plan o crea uno nuevo</p>
            <button 
              onClick={() => setShowCreatePlan(true)}
              className="bg-slate-900 text-white rounded-xl px-4 py-2.5 font-medium hover:bg-slate-800 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Vista 3: Estadísticas
const EvalStatsView = ({ isAdmin }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(mockEmployees[0]);
  const results = mockEvaluationResults.find(r => r.employeeId === selectedEmployee.id);
  const plan = mockEvaluationPlans.find(p => p.employeeId === selectedEmployee.id);
  
  if (!results || !plan) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
        <BarChart2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">No hay resultados disponibles</p>
      </div>
    );
  }

  const template = mockEval360Templates.find(t => t.id === plan.templateId);
  const completed = plan.evaluators.filter(e => e.status === 'completado').length;
  const pending = plan.evaluators.length - completed;

  return (
    <div>
      <div className="mb-6">
        <select 
          value={selectedEmployee.id}
          onChange={(e) => setSelectedEmployee(mockEmployees.find(emp => emp.id === e.target.value))}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5"
        >
          {mockEmployees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
          <CheckCircle2 className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{completed}</p>
          <p className="text-sm opacity-80">Completadas</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-5 text-white">
          <Clock className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{pending}</p>
          <p className="text-sm opacity-80">Pendientes</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white">
          <Award className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{Math.round((completed / plan.evaluators.length) * 100)}%</p>
          <p className="text-sm opacity-80">Progreso</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {template.competencies.map((comp) => {
          const compResults = results.results[comp.id];
          if (!compResults) return null;

          const responseCounts = [0, 0, 0, 0, 0];
          compResults.responses.forEach(r => {
            responseCounts[r.score - 1]++;
          });

          const pieData = responseCounts.map((count, idx) => ({
            name: comp.responses[idx].label,
            value: count,
            color: ['#EF4444', '#F59E0B', '#EAB308', '#84CC16', '#22C55E'][idx]
          }));

          return (
            <div key={comp.id} className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="font-semibold text-slate-900 mb-1">{comp.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{comp.behavior}</p>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">Promedio</span>
                  <span className="text-2xl font-bold text-slate-900">{compResults.average.toFixed(1)}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${(compResults.average / 5) * 100}%` }} />
                </div>
              </div>

              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.value}`}
                      outerRadius={60}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {comp.responses.map((resp, idx) => (
                  <div key={resp.value} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieData[idx].color }} />
                      <span className="text-slate-600">{resp.label}</span>
                    </div>
                    <span className="font-semibold text-slate-900">{responseCounts[idx]} votos</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Vista 4: Tracking
const EvalTrackingView = ({ isAdmin }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const allEvaluations = mockEvaluationPlans.flatMap(plan => 
    plan.evaluators.map(ev => ({
      ...ev,
      employeeName: plan.employeeName,
      planId: plan.id,
      period: plan.period
    }))
  );

  const filtered = filterStatus === 'all' 
    ? allEvaluations 
    : allEvaluations.filter(ev => ev.status === filterStatus);

  const stats = {
    pendiente: allEvaluations.filter(e => e.status === 'pendiente').length,
    enviado: allEvaluations.filter(e => e.status === 'enviado').length,
    completado: allEvaluations.filter(e => e.status === 'completado').length
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div 
          onClick={() => setFilterStatus('all')}
          className={`bg-white border-2 rounded-2xl p-4 cursor-pointer transition-all ${
            filterStatus === 'all' ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <Activity className="w-6 h-6 text-slate-400 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{allEvaluations.length}</p>
          <p className="text-sm text-slate-500">Total</p>
        </div>
        <div 
          onClick={() => setFilterStatus('pendiente')}
          className={`bg-white border-2 rounded-2xl p-4 cursor-pointer transition-all ${
            filterStatus === 'pendiente' ? 'border-yellow-500 ring-2 ring-yellow-500/10' : 'border-slate-200 hover:border-yellow-300'
          }`}
        >
          <Clock className="w-6 h-6 text-yellow-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.pendiente}</p>
          <p className="text-sm text-slate-500">Pendientes</p>
        </div>
        <div 
          onClick={() => setFilterStatus('enviado')}
          className={`bg-white border-2 rounded-2xl p-4 cursor-pointer transition-all ${
            filterStatus === 'enviado' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200 hover:border-blue-300'
          }`}
        >
          <Send className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.enviado}</p>
          <p className="text-sm text-slate-500">Enviados</p>
        </div>
        <div 
          onClick={() => setFilterStatus('completado')}
          className={`bg-white border-2 rounded-2xl p-4 cursor-pointer transition-all ${
            filterStatus === 'completado' ? 'border-green-500 ring-2 ring-green-500/10' : 'border-slate-200 hover:border-green-300'
          }`}
        >
          <CheckCircle2 className="w-6 h-6 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.completado}</p>
          <p className="text-sm text-slate-500">Completados</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Empleado</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Evaluador</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Tipo</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Estado</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Período</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ev, idx) => {
              const evType = evaluatorTypes360.find(t => t.id === ev.type);
              return (
                <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{ev.employeeName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{ev.name}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: `${evType.color}20`, color: evType.color }}>
                      {evType.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {ev.status === 'pendiente' && <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">🟡 Pendiente</span>}
                    {ev.status === 'enviado' && <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">🔵 Enviado</span>}
                    {ev.status === 'completado' && <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">🟢 Completado</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{ev.period}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Vista 5: Resultados y PDI
const EvalResultsPDIView = ({ isAdmin }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(mockEmployees[0]);
  const results = mockEvaluationResults.find(r => r.employeeId === selectedEmployee.id);
  const plan = mockEvaluationPlans.find(p => p.employeeId === selectedEmployee.id);
  const pdi = mockPDIs.find(p => p.employeeId === selectedEmployee.id) || {
    employeeName: selectedEmployee.name,
    department: selectedEmployee.department,
    leader: "Director",
    reviewer: "CEO",
    quarters: [{ quarter: "Q1 2024", meta: "", realidad: "", aprendizajeFormal: "", aprendizajeSocial: "", aprendizajeAplicado: "", voluntad: "", evaluaciones: "" }]
  };

  const [pdiData, setPdiData] = useState(pdi.quarters[0]);

  if (!results || !plan) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
        <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">Selecciona un empleado con resultados</p>
      </div>
    );
  }

  const template = mockEval360Templates.find(t => t.id === plan.templateId);

  return (
    <div className="space-y-6">
      <div>
        <select 
          value={selectedEmployee.id}
          onChange={(e) => setSelectedEmployee(mockEmployees.find(emp => emp.id === e.target.value))}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5"
        >
          {mockEmployees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>

      {/* Parte 1: Resultados 1 a 1 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">📊 Resultados de Evaluación 360°</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {template.competencies.map((comp) => {
            const compResults = results.results[comp.id];
            if (!compResults) return null;

            return (
              <div key={comp.id} className="border border-slate-200 rounded-xl p-4">
                <h3 className="font-semibold text-slate-900 mb-2">{comp.title}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-500">Promedio</span>
                  <span className="text-2xl font-bold text-green-600">{compResults.average.toFixed(1)}/5</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${(compResults.average / 5) * 100}%` }} />
                </div>
                <p className="text-xs text-slate-500 mt-2">Más elegida: {comp.responses[compResults.mostCommon - 1].label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Parte 2: PDI */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-1">📝 Plan de Desarrollo Individual (PDI)</h2>
          <p className="text-sm text-slate-500">Basado en resultados de la evaluación 360°</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
          <div>
            <p className="text-xs text-slate-500">Evaluado</p>
            <p className="font-semibold text-slate-900">{pdi.employeeName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Departamento</p>
            <p className="font-semibold text-slate-900">{pdi.department}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Líder que Reporta</p>
            <p className="font-semibold text-slate-900">{pdi.leader}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Quien Revisa</p>
            <p className="font-semibold text-slate-900">{pdi.reviewer}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Meta - ¿Qué quieres lograr en este trimestre?</label>
            <textarea 
              rows={2}
              value={pdiData.meta}
              onChange={(e) => setPdiData(prev => ({ ...prev, meta: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 resize-none"
              placeholder="Describe tu meta principal para este trimestre..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Realidad - Situación actual y obstáculos</label>
            <textarea 
              rows={2}
              value={pdiData.realidad}
              onChange={(e) => setPdiData(prev => ({ ...prev, realidad: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 resize-none"
              placeholder="Describe tu situación actual y los obstáculos que enfrentas..."
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">OPCIONES DE DESARROLLO</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Aprendizaje Formal</label>
                <input 
                  type="text"
                  value={pdiData.aprendizajeFormal}
                  onChange={(e) => setPdiData(prev => ({ ...prev, aprendizajeFormal: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="Cursos, certificaciones, talleres..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Aprendizaje Social</label>
                <input 
                  type="text"
                  value={pdiData.aprendizajeSocial}
                  onChange={(e) => setPdiData(prev => ({ ...prev, aprendizajeSocial: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="Mentoría, coaching, networking..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Aprendizaje Aplicado</label>
                <input 
                  type="text"
                  value={pdiData.aprendizajeAplicado}
                  onChange={(e) => setPdiData(prev => ({ ...prev, aprendizajeAplicado: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="Proyectos, práctica en el trabajo..."
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Voluntad - Compromiso y actividades específicas</label>
            <textarea 
              rows={2}
              value={pdiData.voluntad}
              onChange={(e) => setPdiData(prev => ({ ...prev, voluntad: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 resize-none"
              placeholder="¿A qué te comprometes? ¿Qué actividades específicas harás?"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Evaluaciones - Cómo se evidenciará el resultado</label>
            <textarea 
              rows={2}
              value={pdiData.evaluaciones}
              onChange={(e) => setPdiData(prev => ({ ...prev, evaluaciones: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 resize-none"
              placeholder="¿Cómo se medirá el progreso y los resultados?"
            />
          </div>

          <button
            onClick={() => alert('PDI guardado (demo)')}
            className="w-full bg-slate-900 text-white rounded-xl px-4 py-3 font-medium hover:bg-slate-800 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar PDI
          </button>
        </div>
      </div>
    </div>
  );
};

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
