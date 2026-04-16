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
  Clock,
  X
} from 'lucide-react';

const Evaluations360View = ({ isAdmin }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('design');
  const [templates, setTemplates] = useState([]);
  const [plans, setPlans] = useState([]);
  const [results, setResults] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para evaluar
  const [myPendingEvaluations, setMyPendingEvaluations] = useState([]);
  const [evaluatingPlan, setEvaluatingPlan] = useState(null);
  const [evaluationResponses, setEvaluationResponses] = useState({});
  
  // Estados para crear plantilla
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    competencies: [{ title: '', behavior: '' }]
  });
  
  // Estados para crear/editar plan
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [newPlan, setNewPlan] = useState({
    employeeId: '',
    templateId: '',
    period: 'Q1 2024',
    dueDate: '',
    evaluators: []
  });
  
  // Estados para editar plantilla
  const [editingTemplate, setEditingTemplate] = useState(null);

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

  const handleCreateTemplate = async () => {
    if (!newTemplate.name) {
      alert('El nombre es obligatorio');
      return;
    }
    try {
      if (editingTemplate) {
        // Editar existente
        await eval360API.updateTemplate(editingTemplate.id, {
          ...newTemplate,
          isActive: true
        });
      } else {
        // Crear nuevo
        await eval360API.createTemplate({
          ...newTemplate,
          isActive: true
        });
      }
      setShowCreateTemplate(false);
      setEditingTemplate(null);
      setNewTemplate({ name: '', description: '', competencies: [{ title: '', behavior: '' }] });
      fetchData();
    } catch (error) {
      alert('Error al guardar plantilla: ' + error.message);
    }
  };

  const addCompetency = () => {
    setNewTemplate({
      ...newTemplate,
      competencies: [...newTemplate.competencies, { title: '', behavior: '' }]
    });
  };

  const updateCompetency = (index, field, value) => {
    const updated = [...newTemplate.competencies];
    updated[index][field] = value;
    setNewTemplate({ ...newTemplate, competencies: updated });
  };

  const removeCompetency = (index) => {
    setNewTemplate({
      ...newTemplate,
      competencies: newTemplate.competencies.filter((_, i) => i !== index)
    });
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

  const handleCreatePlan = async () => {
    if (!newPlan.employeeId || !newPlan.templateId) {
      alert('Empleado y plantilla son obligatorios');
      return;
    }
    try {
      await eval360API.createPlan(newPlan);
      setShowCreatePlan(false);
      setNewPlan({ employeeId: '', templateId: '', period: 'Q1 2024', dueDate: '', evaluators: [] });
      fetchData();
    } catch (error) {
      alert('Error al crear plan: ' + error.message);
    }
  };

  const tabs = [
    { id: 'design', label: 'Diseñar Plantillas', icon: FileText },
    { id: 'planning', label: 'Planificación', icon: Calendar },
    { id: 'evaluate', label: 'Evaluar', icon: Users },
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

      {isAdmin && (
        <button
          onClick={() => setShowCreateTemplate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4"
        >
          <Plus className="w-4 h-4" />
          Crear Nueva Plantilla
        </button>
      )}

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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingTemplate(template);
                    setNewTemplate({
                      name: template.name,
                      description: template.description,
                      competencies: template.competencies || [{title: '', behavior: ''}]
                    });
                    setShowCreateTemplate(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Editar plantilla"
                >
                  <FileText className="w-4 h-4" />
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
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

      {isAdmin && (
        <button
          onClick={() => setShowCreatePlan(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mb-4"
        >
          <Plus className="w-4 h-4" />
          Crear Nuevo Plan
        </button>
      )}

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

  // Tab: Evaluar (Mis evaluaciones pendientes)
  const EvaluateTab = () => {
    const handleStartEvaluation = (plan) => {
      const template = templates.find(t => t.id === plan.templateId);
      setEvaluatingPlan({ ...plan, template });
      // Inicializar respuestas vacías
      const initialResponses = {};
      template?.competencies?.forEach((comp, idx) => {
        initialResponses[idx] = { score: 50, comments: '' };
      });
      setEvaluationResponses(initialResponses);
    };

    const handleSubmitEvaluation = async () => {
      if (!evaluatingPlan) return;
      
      try {
        const evaluationData = {
          planId: evaluatingPlan.id,
          evaluatorId: user.employee_id,
          responses: Object.values(evaluationResponses)
        };
        
        await eval360API.submitEvaluation(evaluationData);
        alert('Evaluación enviada exitosamente');
        setEvaluatingPlan(null);
        setEvaluationResponses({});
        fetchData();
      } catch (error) {
        alert('Error al enviar evaluación: ' + error.message);
      }
    };

    if (evaluatingPlan) {
      return (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Evaluando: {evaluatingPlan.employeeName}</h3>
                <p className="text-sm text-slate-500">Plantilla: {evaluatingPlan.template?.name}</p>
              </div>
              <button
                onClick={() => setEvaluatingPlan(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {evaluatingPlan.template?.competencies?.map((comp, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-1">{comp.title}</h4>
                  <p className="text-sm text-slate-600 mb-4">{comp.behavior}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Puntuación: {evaluationResponses[idx]?.score || 50}/100</label>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={evaluationResponses[idx]?.score || 50}
                        onChange={(e) => setEvaluationResponses({
                          ...evaluationResponses,
                          [idx]: { ...evaluationResponses[idx], score: parseInt(e.target.value) }
                        })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>Bajo</span>
                        <span>Medio</span>
                        <span>Alto</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Comentarios (opcional)</label>
                      <textarea
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        rows="2"
                        placeholder="Agrega comentarios sobre esta competencia..."
                        value={evaluationResponses[idx]?.comments || ''}
                        onChange={(e) => setEvaluationResponses({
                          ...evaluationResponses,
                          [idx]: { ...evaluationResponses[idx], comments: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEvaluatingPlan(null)}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitEvaluation}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Enviar Evaluación
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-medium text-blue-900 mb-2">Mis Evaluaciones Pendientes</h3>
          <p className="text-sm text-blue-700">
            Tienes {myPendingEvaluations.length} evaluación(es) pendiente(s) por completar.
          </p>
        </div>

        {myPendingEvaluations.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="text-slate-600">No tienes evaluaciones pendientes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myPendingEvaluations.map((plan) => (
              <div key={plan.id} className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">{plan.employeeName}</h4>
                    <p className="text-sm text-slate-500">
                      Plantilla: {templates.find(t => t.id === plan.templateId)?.name || 'N/A'}
                    </p>
                    <p className="text-xs text-slate-400">Vence: {plan.dueDate || 'Sin fecha límite'}</p>
                  </div>
                  <button
                    onClick={() => handleStartEvaluation(plan)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Evaluar Ahora
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

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
      {activeTab === 'evaluate' && <EvaluateTab />}
      {activeTab === 'stats' && <StatsTab />}
      {activeTab === 'tracking' && <TrackingTab />}
      
      {/* Modal: Crear Plantilla */}
      {showCreateTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col">
            <div className="bg-white border-b border-slate-200 p-6 flex-shrink-0 rounded-t-2xl">
              <h2 className="text-xl font-semibold">{editingTemplate ? 'Editar Plantilla' : 'Crear Nueva Plantilla'}</h2>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre de la Plantilla *</label>
                <input
                  type="text"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2"
                  placeholder="Ej: Evaluación Liderazgo"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  className="w-full border border-slate-300 rounded-lg px-4 py-2"
                  rows="3"
                  placeholder="Describe el propósito de esta plantilla..."
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Competencias</label>
                  <button
                    onClick={addCompetency}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Agregar Competencia
                  </button>
                </div>
                
                <div className="space-y-3">
                  {newTemplate.competencies.map((comp, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Competencia {idx + 1}</span>
                        {newTemplate.competencies.length > 1 && (
                          <button
                            onClick={() => removeCompetency(idx)}
                            className="text-red-500 text-sm"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                      
                      <input
                        type="text"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-2"
                        placeholder="Título (Ej: Comunicación Efectiva)"
                        value={comp.title}
                        onChange={(e) => updateCompetency(idx, 'title', e.target.value)}
                      />
                      
                      <textarea
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        rows="2"
                        placeholder="Comportamiento observable (Ej: Escucha activamente...)"
                        value={comp.behavior}
                        onChange={(e) => updateCompetency(idx, 'behavior', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-200 p-6 flex gap-3 flex-shrink-0">
              <button
                onClick={() => setShowCreateTemplate(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTemplate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingTemplate ? 'Guardar Cambios' : 'Crear Plantilla'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Crear Plan */}
      {showCreatePlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full my-4">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-semibold">Crear Nuevo Plan de Evaluación</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Empleado a Evaluar *</label>
                  <select
                    className="w-full border border-slate-300 rounded-lg px-4 py-2"
                    value={newPlan.employeeId}
                    onChange={(e) => setNewPlan({...newPlan, employeeId: e.target.value})}
                  >
                    <option value="">Selecciona...</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Plantilla *</label>
                  <select
                    className="w-full border border-slate-300 rounded-lg px-4 py-2"
                    value={newPlan.templateId}
                    onChange={(e) => setNewPlan({...newPlan, templateId: e.target.value})}
                  >
                    <option value="">Selecciona...</option>
                    {templates.map(tmpl => (
                      <option key={tmpl.id} value={tmpl.id}>{tmpl.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Periodo</label>
                  <input
                    type="text"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2"
                    placeholder="Q1 2024"
                    value={newPlan.period}
                    onChange={(e) => setNewPlan({...newPlan, period: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2"
                    value={newPlan.dueDate}
                    onChange={(e) => setNewPlan({...newPlan, dueDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Evaluadores</label>
                <div className="border border-slate-200 rounded-lg p-4 space-y-3">
                  <p className="text-xs text-slate-500 mb-3">Selecciona quién evaluará a este empleado (puedes seleccionar múltiples)</p>
                  
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {employees.filter(emp => emp.id !== newPlan.employeeId).map(emp => (
                      <label key={emp.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newPlan.evaluators?.includes(emp.id) || false}
                          onChange={(e) => {
                            const currentEvaluators = newPlan.evaluators || [];
                            const newEvaluators = e.target.checked
                              ? [...currentEvaluators, emp.id]
                              : currentEvaluators.filter(id => id !== emp.id);
                            setNewPlan({...newPlan, evaluators: newEvaluators});
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{emp.name}</span>
                        <span className="text-xs text-slate-500">({emp.area || emp.department})</span>
                      </label>
                    ))}
                  </div>
                  
                  {newPlan.evaluators && newPlan.evaluators.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <p className="text-xs text-slate-600">
                        {newPlan.evaluators.length} evaluador(es) seleccionado(s)
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Puedes agregar más evaluadores después de crear el plan en la sección de Tracking.
                </p>
              </div>
            </div>
            
            <div className="border-t border-slate-200 p-6 flex gap-3">
              <button
                onClick={() => setShowCreatePlan(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreatePlan}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Crear Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evaluations360View;


