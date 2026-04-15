import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { eval360API, employeesAPI } from '../services/api';
import { 
  FileText, 
  Calendar, 
  BarChart3, 
  Eye, 
  Link as LinkIcon,
  Plus,
  Trash2,
  Users,
  CheckCircle2,
  Clock
} from 'lucide-react';

const Evaluations360View = ({ isAdmin }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('design');
  const [templates, setTemplates] = useState([]);
  const [plans, setPlans] = useState([]);
  const [results, setResults] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [templatesData, plansData, resultsData, employeesData] = await Promise.all([
        eval360API.getTemplates(),
        eval360API.getPlans(),
        eval360API.getResults(),
        employeesAPI.getAll()
      ]);
      
      setTemplates(templatesData);
      setPlans(plansData);
      setResults(resultsData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching Eval360 data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!window.confirm('¿Eliminar esta plantilla?')) return;
    try {
      await eval360API.deleteTemplate(id);
      fetchData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('¿Eliminar este plan?')) return;
    try {
      await eval360API.deletePlan(id);
      fetchData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const tabs = [
    { id: 'design', label: 'Diseñar Plantillas', icon: FileText },
    { id: 'planning', label: 'Planificación', icon: Calendar },
    { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
    { id: 'tracking', label: 'Tracking', icon: Eye },
  ];

  // Tab: Design (Templates)
  const DesignTab = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <h3 className="font-medium text-blue-900 mb-2">Plantillas de Evaluación 360</h3>
        <p className="text-sm text-blue-700">
          Crea plantillas personalizadas con competencias específicas. Define comportamientos observables y escalas de respuesta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{template.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    template.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {template.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {template.competencies?.length || 0} competencias
                  </span>
                </div>
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="space-y-2 mt-4">
              {template.competencies?.slice(0, 3).map((comp, idx) => (
                <div key={idx} className="text-sm p-2 bg-slate-50 rounded">
                  <p className="font-medium text-slate-700">{comp.title}</p>
                  <p className="text-xs text-slate-500">{comp.behavior}</p>
                </div>
              ))}
              {template.competencies?.length > 3 && (
                <p className="text-xs text-slate-400">+{template.competencies.length - 3} más...</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Tab: Planning
  const PlanningTab = () => (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
        <h3 className="font-medium text-purple-900 mb-2">Planificar Evaluaciones</h3>
        <p className="text-sm text-purple-700">
          Asigna evaluadores (superior, pares, subordinados, clientes, autoevaluación) a cada empleado.
        </p>
      </div>

      <div className="space-y-3">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-slate-900">{plan.employeeName}</h4>
                <p className="text-sm text-slate-500">Plantilla: {plan.templateName}</p>
                <p className="text-xs text-slate-400">Periodo: {plan.period} | Vencimiento: {plan.dueDate}</p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-2">Evaluadores por tipo:</p>
              <div className="flex flex-wrap gap-2">
                {plan.evaluators?.map((ev, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {ev.type}: {ev.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Tab: Stats
  const StatsTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold mb-4">Resumen de Evaluaciones</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{templates.length}</p>
            <p className="text-sm text-blue-700">Plantillas Activas</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{plans.length}</p>
            <p className="text-sm text-green-700">Planes en Curso</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">{results.length}</p>
            <p className="text-sm text-purple-700">Evaluaciones Completadas</p>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Resultados por Empleado</h3>
          <div className="space-y-3">
            {results.map((result, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-medium">{result.employeeName || 'N/A'}</span>
                <span className="text-sm text-slate-500">Evaluaciones: {result.totalEvaluations || 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Tab: Tracking
  const TrackingTab = () => {
    const allEvaluators = plans.flatMap(p => p.evaluators || []);
    const completed = allEvaluators.filter(e => e.status === 'completado').length;
    const pending = allEvaluators.filter(e => e.status === 'pendiente').length;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-600">{completed}</p>
                <p className="text-sm text-slate-500">Completadas</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{pending}</p>
                <p className="text-sm text-slate-500">Pendientes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="font-semibold mb-4">Seguimiento Detallado</h3>
          <div className="space-y-3">
            {plans.map((plan) => {
              const completedEvals = plan.evaluators?.filter(e => e.status === 'completado').length || 0;
              const totalEvals = plan.evaluators?.length || 0;
              const progress = totalEvals > 0 ? (completedEvals / totalEvals) * 100 : 0;

              return (
                <div key={plan.id} className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium">{plan.employeeName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{completedEvals}/{totalEvals}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p>Cargando...</p></div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
          Evaluaciones 360°
        </h1>
        <p className="text-slate-500 mt-1">Sistema integral de retroalimentación multifuente</p>
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

      {/* Tab Content */}
      {activeTab === 'design' && <DesignTab />}
      {activeTab === 'planning' && <PlanningTab />}
      {activeTab === 'stats' && <StatsTab />}
      {activeTab === 'tracking' && <TrackingTab />}
    </div>
  );
};

export default Evaluations360View;
