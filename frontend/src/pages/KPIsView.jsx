import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { kpisAPI, employeesAPI } from '../services/api';
import { 
  FileText, 
  UserPlus, 
  ClipboardEdit, 
  BarChart2, 
  Plus, 
  Edit3, 
  Trash2,
  X,
  Save
} from 'lucide-react';

const KPIsView = ({ isAdmin }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('templates');
  const [templates, setTemplates] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showCreateKPI, setShowCreateKPI] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [templatesData, assignmentsData, evaluationsData, employeesData] = await Promise.all([
        kpisAPI.getTemplates(),
        kpisAPI.getAssignments(),
        kpisAPI.getEvaluations(),
        employeesAPI.getAll()
      ]);
      
      setTemplates(templatesData);
      setAssignments(assignmentsData);
      setEvaluations(evaluationsData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching KPIs data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!window.confirm('¿Eliminar esta plantilla KPI?')) return;
    try {
      await kpisAPI.deleteTemplate(id);
      fetchData();
    } catch (error) {
      alert('Error al eliminar plantilla: ' + error.message);
    }
  };

  const tabs = [
    { id: 'templates', label: 'Plantillas KPI', icon: FileText },
    { id: 'assign', label: 'Asignar a Empleados', icon: UserPlus },
    { id: 'evaluate', label: 'Evaluar KPIs', icon: ClipboardEdit },
    { id: 'compare', label: 'Comparativa', icon: BarChart2 },
  ];

  // Tab: Templates
  const TemplatesTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {templates.map((template) => (
        <div key={template.id} className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">{template.nombre}</h3>
              <p className="text-sm text-slate-500">{template.descripcion}</p>
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <>
                  <button 
                    onClick={() => { setSelectedTemplate(template); setShowAssignModal(true); }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
          
          <p className="text-xs text-slate-400 mb-3">Área: {template.area}</p>
          
          <div className="space-y-2">
            {template.metricas.map((kpi) => (
              <div key={kpi.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-slate-700">{kpi.nombre}</p>
                  <p className="text-xs text-slate-500">{kpi.descripcion}</p>
                </div>
                <span className="text-xs font-medium text-slate-600">{kpi.peso}%</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // Tab: Assignments
  const AssignTab = () => (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <div key={assignment.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900">{assignment.employeeName}</h4>
            <p className="text-sm text-slate-500">Plantilla: {assignment.templateNombre}</p>
            <p className="text-xs text-slate-400">Periodo: {assignment.periodo}</p>
          </div>
          <button
            onClick={() => {
              setSelectedAssignment(assignment);
              setShowEvaluateModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Evaluar
          </button>
        </div>
      ))}
    </div>
  );

  // Tab: Evaluations
  const EvaluateTab = () => (
    <div className="space-y-4">
      {evaluations.map((evaluation) => (
        <div key={evaluation.id} className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-slate-900">{evaluation.employeeName}</h4>
              <p className="text-sm text-slate-500">{evaluation.templateNombre} - {evaluation.periodo}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{evaluation.scoreTotal}%</p>
              <p className="text-xs text-slate-500">Score Total</p>
            </div>
          </div>
          <div className="space-y-2">
            {evaluation.metricas.map((metrica, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{metrica.nombre}</span>
                <span className="font-medium">{metrica.valorObtenido}% (Peso: {metrica.peso}%)</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // Tab: Compare
  const CompareTab = () => {
    const employeeScores = evaluations.map(ev => ({
      name: ev.employeeName,
      score: ev.scoreTotal,
      period: ev.periodo
    }));

    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Comparativa de Scores KPI</h3>
        <div className="space-y-3">
          {employeeScores.map((emp, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{emp.name}</span>
                <span className="text-slate-500">{emp.score}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500"
                  style={{ width: `${emp.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Modal: Assign KPI
  const AssignModal = () => {
    const [assignData, setAssignData] = useState({
      templateId: selectedTemplate?.id || '',
      employeeId: '',
      periodo: 'Q1 2024'
    });

    const handleAssign = async () => {
      try {
        await kpisAPI.createAssignment(assignData);
        setShowAssignModal(false);
        fetchData();
      } catch (error) {
        alert('Error al asignar KPI: ' + error.message);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Asignar KPI a Empleado</h3>
            <button onClick={() => setShowAssignModal(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Plantilla</label>
              <p className="text-sm text-slate-600">{selectedTemplate?.nombre}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Empleado</label>
              <select
                className="w-full border border-slate-300 rounded-lg px-4 py-2"
                value={assignData.employeeId}
                onChange={(e) => setAssignData({...assignData, employeeId: e.target.value})}
              >
                <option value="">Selecciona</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Periodo</label>
              <input
                type="text"
                className="w-full border border-slate-300 rounded-lg px-4 py-2"
                value={assignData.periodo}
                onChange={(e) => setAssignData({...assignData, periodo: e.target.value})}
                placeholder="Q1 2024"
              />
            </div>
            <button
              onClick={handleAssign}
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
            >
              Asignar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal: Evaluate KPI
  const EvaluateModal = () => {
    const [evalData, setEvalData] = useState({
      metricas: selectedAssignment?.templateId ? 
        templates.find(t => t.id === selectedAssignment.templateId)?.metricas.map(m => ({
          metricaId: m.id,
          nombre: m.nombre,
          valorObtenido: 0,
          peso: m.peso
        })) || [] : []
    });

    const handleEvaluate = async () => {
      try {
        await kpisAPI.createEvaluation({
          assignmentId: selectedAssignment.id,
          metricas: evalData.metricas,
          evaluatedBy: user.id
        });
        setShowEvaluateModal(false);
        fetchData();
      } catch (error) {
        alert('Error al evaluar KPI: ' + error.message);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Evaluar KPIs</h3>
            <button onClick={() => setShowEvaluateModal(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Empleado: {selectedAssignment?.employeeName} <br />
            Periodo: {selectedAssignment?.periodo}
          </p>
          <div className="space-y-4">
            {evalData.metricas.map((metrica, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium mb-1">
                  {metrica.nombre} (Peso: {metrica.peso}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metrica.valorObtenido}
                  onChange={(e) => {
                    const newMetricas = [...evalData.metricas];
                    newMetricas[idx].valorObtenido = parseInt(e.target.value);
                    setEvalData({...evalData, metricas: newMetricas});
                  }}
                  className="w-full"
                />
                <p className="text-sm text-slate-600 mt-1">{metrica.valorObtenido}%</p>
              </div>
            ))}
            <button
              onClick={handleEvaluate}
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
            >
              Guardar Evaluación
            </button>
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Gestión de KPIs
          </h1>
          <p className="text-slate-500 mt-1">Crea, asigna y evalúa indicadores clave</p>
        </div>
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
      {activeTab === 'templates' && <TemplatesTab />}
      {activeTab === 'assign' && <AssignTab />}
      {activeTab === 'evaluate' && <EvaluateTab />}
      {activeTab === 'compare' && <CompareTab />}

      {/* Modals */}
      {showAssignModal && <AssignModal />}
      {showEvaluateModal && selectedAssignment && <EvaluateModal />}
    </div>
  );
};

export default KPIsView;
