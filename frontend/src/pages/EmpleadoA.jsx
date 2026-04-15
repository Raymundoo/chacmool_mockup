import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { empleadoAAPI, employeesAPI } from '../services/api';
import { classificationMatrix, classificationColors } from '../utils/classifications';
import { 
  Grid3X3, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus,
  Trash2,
  UserX
} from 'lucide-react';

const EmpleadoAPage = ({ isAdmin }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('matriz');
  const [employees, setEmployees] = useState([]);
  const [plans, setPlans] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [pendingEvaluations, setPendingEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para evaluación visual
  const [evaluatingPlan, setEvaluatingPlan] = useState(null);
  const [selectedCuadrante, setSelectedCuadrante] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesData, plansData, resultsData, pendingData] = await Promise.all([
        employeesAPI.getAll(),
        empleadoAAPI.getPlans(),
        isAdmin ? empleadoAAPI.getAllResults() : Promise.resolve([]),
        empleadoAAPI.getMyPendingEvaluations()
      ]);
      
      setEmployees(employeesData);
      setPlans(plansData);
      setAllResults(resultsData);
      setPendingEvaluations(pendingData);
      
      // Para empleados, seleccionar automáticamente su propio perfil
      if (!isAdmin && user?.employee_id) {
        const myEmployee = employeesData.find(e => e.id === user.employee_id);
        if (myEmployee) {
          setSelectedEmployee(myEmployee);
          try {
            const myResults = await empleadoAAPI.getEmployeeResults(user.employee_id);
            setSelectedResult(myResults);
          } catch (err) {
            console.log('No results found for employee');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tab: Matriz (Grid 9-Box con miniaturas de evaluadores)
  const MatrizTab = () => {
    const handleEmployeeSelect = async (emp) => {
      setSelectedEmployee(emp);
      try {
        const results = await empleadoAAPI.getEmployeeResults(emp.id);
        setSelectedResult(results);
      } catch (err) {
        setSelectedResult(null);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Grid3X3 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900">Matriz de Clasificación de Empleados</h3>
              <p className="text-sm text-blue-700 mt-1">
                <strong>Eje Y:</strong> VALORES (comportamientos y actitudes) | <strong>Eje X:</strong> RESULTADOS (cumplimiento de metas)
              </p>
            </div>
          </div>
        </div>

        {/* Selector de empleado (solo admin) */}
        {isAdmin && (
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Seleccionar Empleado para Ver Detalles
            </label>
            <select
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
              onChange={(e) => {
                const emp = employees.find(emp => emp.id === e.target.value);
                if (emp) handleEmployeeSelect(emp);
              }}
              value={selectedEmployee?.id || ''}
            >
              <option value="">Selecciona un empleado</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Grid 9-Box con miniaturas */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="grid grid-cols-3 gap-3">
            {["B3", "B2", "A", "C4", "B1", "B4", "C1", "C2", "C3"].map((code) => {
              const config = classificationMatrix[code];
              const colors = classificationColors[config.color];
              
              // Obtener empleados en este cuadrante
              const employeesInQuadrant = allResults.filter(r => r.cuadrante_mayoria === code);
              
              return (
                <div
                  key={code}
                  className="rounded-xl border-2 p-4 min-h-[200px] flex flex-col"
                  style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                >
                  <div className="text-center mb-2">
                    <span className="text-2xl font-bold" style={{ color: colors.text }}>{code}</span>
                    <p className="text-xs font-medium" style={{ color: colors.text }}>{config.label}</p>
                    <p className="text-xs mt-1" style={{ color: colors.text }}>
                      V: {config.valores.min}-{config.valores.max}% | R: {config.resultados.min}-{config.resultados.max}%
                    </p>
                  </div>
                  
                  {/* Miniaturas de empleados y evaluadores */}
                  <div className="flex-1 space-y-2 mt-2">
                    {employeesInQuadrant.map(result => (
                      <div key={result.employee_id} className="bg-white/70 rounded-lg p-2">
                        <p className="text-xs font-medium" style={{ color: colors.text }}>
                          {result.employee_name}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {result.all_votes?.map((vote, idx) => (
                            <div key={idx} className="relative group">
                              {isAdmin ? (
                                <img 
                                  src={vote.evaluator_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${vote.evaluator_name}`}
                                  alt={vote.evaluator_name}
                                  className="w-6 h-6 rounded-full border border-white"
                                  title={vote.evaluator_name}
                                />
                              ) : (
                                <div 
                                  className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center"
                                  title="Evaluador"
                                >
                                  <UserX className="w-3 h-3 text-slate-500" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detalle del empleado seleccionado */}
        {selectedEmployee && selectedResult && (
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              Detalles de Evaluación: {selectedEmployee.name}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600">Promedio Valores</p>
                <p className="text-3xl font-bold text-purple-900">{selectedResult.promedio_valores}%</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Promedio Resultados</p>
                <p className="text-3xl font-bold text-blue-900">{selectedResult.promedio_resultados}%</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Clasificación por Evaluadores ({selectedResult.total_votos} votos)</h4>
              <div className="space-y-2">
                {Object.entries(selectedResult.votos_por_cuadrante).map(([cuad, count]) => (
                  <div key={cuad} className="flex items-center gap-2">
                    <span className="w-12 text-sm font-medium">{cuad}:</span>
                    <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ width: `${(count / selectedResult.total_votos) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">{count} votos</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Evaluadores</h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedResult.all_votes.map((vote, idx) => (
                  <div key={idx} className="p-3 border border-slate-200 rounded-lg flex items-center gap-3">
                    {isAdmin ? (
                      <>
                        <img 
                          src={vote.evaluator_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${vote.evaluator_name}`}
                          alt="" 
                          className="w-8 h-8 rounded-full" 
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{vote.evaluator_name}</p>
                          <p className="text-xs text-slate-500">Votó: {vote.cuadrante}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                          <UserX className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-400">Evaluador {idx + 1}</p>
                          <p className="text-xs text-slate-500">Votó: {vote.cuadrante}</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Tab: Planificación (solo admin)
  const PlanificacionTab = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPlan, setNewPlan] = useState({
      employee_id: '',
      period: 'Q1 2024',
      fecha_limite: '',
      evaluator_ids: []
    });

    const handleCreatePlan = async () => {
      try {
        await empleadoAAPI.createPlan(newPlan);
        setShowCreateForm(false);
        setNewPlan({ employee_id: '', period: 'Q1 2024', fecha_limite: '', evaluator_ids: [] });
        fetchData();
      } catch (error) {
        alert('Error al crear plan: ' + error.message);
      }
    };

    const handleDeletePlan = async (planId) => {
      if (!window.confirm('¿Eliminar este plan de evaluación?')) return;
      try {
        await empleadoAAPI.deletePlan(planId);
        fetchData();
      } catch (error) {
        alert('Error al eliminar plan: ' + error.message);
      }
    };

    return (
      <div className="space-y-4">
        {isAdmin && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Crear Nuevo Plan de Evaluación
          </button>
        )}

        {showCreateForm && (
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Nuevo Plan de Evaluación</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Empleado a Evaluar</label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-4 py-2"
                  value={newPlan.employee_id}
                  onChange={(e) => setNewPlan({...newPlan, employee_id: e.target.value})}
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
                  value={newPlan.fecha_limite}
                  onChange={(e) => setNewPlan({...newPlan, fecha_limite: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Evaluadores (selecciona varios)</label>
                <select
                  multiple
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 h-32"
                  value={newPlan.evaluator_ids}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setNewPlan({...newPlan, evaluator_ids: selected});
                  }}
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Mantén Ctrl/Cmd para seleccionar múltiples</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreatePlan}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Crear Plan
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-slate-200 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {plans.map(plan => (
            <div key={plan.id} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{plan.employee_name}</h4>
                  <p className="text-sm text-slate-500">Periodo: {plan.period}</p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>{plan.evaluaciones_completadas} completadas</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>{plan.evaluaciones_pendientes} pendientes</span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-1">Evaluadores:</p>
                <div className="flex flex-wrap gap-2">
                  {plan.evaluators.map(ev => (
                    <span
                      key={ev.id}
                      className={`text-xs px-2 py-1 rounded ${
                        ev.status === 'completado' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {ev.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Tab: Evaluar (Listado + Evaluación Visual)
  const EvaluarTab = () => {
    const handleStartEvaluation = (plan) => {
      setEvaluatingPlan(plan);
      setSelectedCuadrante(null);
    };

    const handleCuadranteClick = (code) => {
      setSelectedCuadrante(code);
    };

    const handleSubmitVote = async () => {
      if (!selectedCuadrante || !evaluatingPlan) {
        alert('Por favor selecciona un cuadrante');
        return;
      }

      const config = classificationMatrix[selectedCuadrante];
      // Usar promedios de los rangos como valores
      const valoresScore = Math.round((config.valores.min + config.valores.max) / 2);
      const resultadosScore = Math.round((config.resultados.min + config.resultados.max) / 2);

      try {
        await empleadoAAPI.submitVote(evaluatingPlan.id, {
          cuadrante: selectedCuadrante,
          valores_score: valoresScore,
          resultados_score: resultadosScore,
          comentarios: `Evaluación visual - ${config.label}`
        });
        alert('Evaluación enviada exitosamente');
        setEvaluatingPlan(null);
        setSelectedCuadrante(null);
        fetchData();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    };

    if (evaluatingPlan) {
      return (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-2">
              Evaluando: {evaluatingPlan.employee_name}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Periodo: {evaluatingPlan.period} | Haz clic en el cuadrante donde clasificarías a este empleado
            </p>

            {/* Grid Visual Clickeable */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {["B3", "B2", "A", "C4", "B1", "B4", "C1", "C2", "C3"].map((code) => {
                const config = classificationMatrix[code];
                const colors = classificationColors[config.color];
                const isSelected = selectedCuadrante === code;

                return (
                  <button
                    key={code}
                    onClick={() => handleCuadranteClick(code)}
                    className={`rounded-xl border-2 p-6 min-h-[120px] flex flex-col items-center justify-center cursor-pointer transition-all ${
                      isSelected ? 'ring-4 ring-blue-500 scale-105' : 'hover:scale-102'
                    }`}
                    style={{ 
                      backgroundColor: colors.bg, 
                      borderColor: isSelected ? '#3b82f6' : colors.border 
                    }}
                  >
                    <span className="text-3xl font-bold mb-1" style={{ color: colors.text }}>{code}</span>
                    <p className="text-sm font-medium text-center" style={{ color: colors.text }}>{config.label}</p>
                    <p className="text-xs mt-2 text-center" style={{ color: colors.text }}>
                      V: {config.valores.min}-{config.valores.max}%
                      <br />
                      R: {config.resultados.min}-{config.resultados.max}%
                    </p>
                  </button>
                );
              })}
            </div>

            {selectedCuadrante && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="font-medium text-blue-900">Seleccionaste: {classificationMatrix[selectedCuadrante].label}</p>
                <p className="text-sm text-blue-700 mt-1">{classificationMatrix[selectedCuadrante].description}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmitVote}
                disabled={!selectedCuadrante}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Enviar Evaluación
              </button>
              <button
                onClick={() => {
                  setEvaluatingPlan(null);
                  setSelectedCuadrante(null);
                }}
                className="px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Listado de evaluaciones pendientes
    if (pendingEvaluations.length === 0) {
      return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <p className="text-slate-600">No tienes evaluaciones pendientes</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-medium text-blue-900">Evaluaciones Pendientes</h3>
          <p className="text-sm text-blue-700 mt-1">
            Tienes {pendingEvaluations.length} evaluación(es) pendiente(s). Haz clic en "Evaluar" para clasificar al colaborador.
          </p>
        </div>

        {pendingEvaluations.map((plan) => (
          <div key={plan.id} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">{plan.employee_name}</h4>
                <p className="text-sm text-slate-500">Periodo: {plan.period}</p>
                <p className="text-xs text-slate-400">Vence: {plan.fecha_limite}</p>
              </div>
              <button
                onClick={() => handleStartEvaluation(plan)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Evaluar
              </button>
            </div>
          </div>
        ))}
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
          Empleado A
        </h1>
        <p className="text-slate-500 mt-1">Clasificación de Empleados A, B y C</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('matriz')}
            className={`px-4 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'matriz'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Grid3X3 className="w-4 h-4 inline mr-2" />
            Matriz
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('planificacion')}
              className={`px-4 py-2 border-b-2 font-medium transition-colors ${
                activeTab === 'planificacion'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Planificación
            </button>
          )}
          <button
            onClick={() => setActiveTab('evaluar')}
            className={`px-4 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'evaluar'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Evaluar {pendingEvaluations.length > 0 && `(${pendingEvaluations.length})`}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'matriz' && <MatrizTab />}
      {activeTab === 'planificacion' && <PlanificacionTab />}
      {activeTab === 'evaluar' && <EvaluarTab />}
    </div>
  );
};

export default EmpleadoAPage;
