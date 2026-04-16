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
  UserX,
  User
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
  const [autoevaluacion, setAutoevaluacion] = useState(null);
  
  // Estado para evaluación visual
  const [evaluatingPlan, setEvaluatingPlan] = useState(null);
  const [selectedCuadrante, setSelectedCuadrante] = useState(null);
  
  // Estado para autoevaluación
  const [showAutoevalForm, setShowAutoevalForm] = useState(false);
  const [autoevalCuadrante, setAutoevalCuadrante] = useState(null);

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
      
      // Para TODOS los usuarios, seleccionar su propio perfil automáticamente
      if (user?.employee_id) {
        const myEmployee = employeesData.find(e => e.id === user.employee_id);
        if (myEmployee) {
          setSelectedEmployee(myEmployee);
          await loadEmployeeData(user.employee_id);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeeData = async (employeeId) => {
    try {
      const [results, autoeval] = await Promise.all([
        empleadoAAPI.getEmployeeResults(employeeId).catch(() => null),
        empleadoAAPI.getAutoevaluacion(employeeId, 'Q1 2024').catch(() => null)
      ]);
      setSelectedResult(results);
      setAutoevaluacion(autoeval);
    } catch (err) {
      console.log('Error loading employee data');
    }
  };

  // Tab: Matriz (Grid 9-Box con miniaturas de evaluadores)
  const MatrizTab = () => {
    const [filterDepartment, setFilterDepartment] = useState('all');
    
    const handleEmployeeSelect = async (emp) => {
      setSelectedEmployee(emp);
      await loadEmployeeData(emp.id);
    };

    // Calcular cuántas personas faltan por evaluar al empleado seleccionado
    const plan = plans.find(p => p.employee_id === selectedEmployee?.id);
    const pendingEvaluators = plan?.evaluaciones_pendientes || 0;

    // Obtener departamentos únicos
    const departments = ['all', ...new Set(employees.map(e => e.area || e.department).filter(Boolean))];
    
    // Filtrar empleados por departamento
    const filteredEmployees = filterDepartment === 'all' 
      ? employees 
      : employees.filter(e => (e.area || e.department) === filterDepartment);

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Grid3X3 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900">Matriz de Clasificación de Empleados</h3>
              <p className="text-sm text-blue-700 mt-1">
                <strong>Eje Y:</strong> VALORES (comportamientos y actitudes) | <strong>Eje X:</strong> RESULTADOS (cumplimiento de metas)
              </p>
            </div>
            {selectedEmployee && (
              <div className="bg-white rounded-lg px-4 py-2 border border-blue-300">
                <p className="text-xs text-blue-600 font-medium">Evaluadores Pendientes</p>
                <p className="text-2xl font-bold text-blue-900">{pendingEvaluators}</p>
                <p className="text-xs text-blue-500">personas por evaluarte</p>
              </div>
            )}
          </div>
        </div>

        {/* Selector de empleado - SOLO VISIBLE PARA ADMIN */}
        {isAdmin && (
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Filtrar por Departamento
                </label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-4 py-2"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  <option value="all">Todos los departamentos</option>
                  {departments.filter(d => d !== 'all').map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ver Empleado
                </label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-4 py-2"
                  onChange={(e) => {
                    const emp = filteredEmployees.find(emp => emp.id === e.target.value);
                    if (emp) handleEmployeeSelect(emp);
                  }}
                  value={selectedEmployee?.id || ''}
                >
                  <option value="">Selecciona un empleado</option>
                  {filteredEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Grid 9-Box con iconos/nombres */}
        {selectedResult && selectedResult.total_votos > 0 ? (
          // CASO 1: HAY VOTOS - Mostrar matriz con evaluadores
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="grid grid-cols-3 gap-3">
            {["B3", "B2", "A", "C4", "B1", "B4", "C1", "C2", "C3"].map((code) => {
              const config = classificationMatrix[code];
              const colors = classificationColors[config.color];
              
              // Obtener votos para este cuadrante del empleado seleccionado
              const votesInQuadrant = selectedResult?.all_votes?.filter(v => v.cuadrante === code) || [];
              
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
                  
                  {/* Miniaturas de evaluadores */}
                  <div className="flex-1 flex flex-wrap gap-1 mt-2 justify-center">
                    {votesInQuadrant.map((vote, idx) => (
                      <div key={idx} className="relative group">
                        {isAdmin ? (
                          <img 
                            src={vote.evaluator_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${vote.evaluator_name}`}
                            alt={vote.evaluator_name}
                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                            title={vote.evaluator_name}
                          />
                        ) : (
                          <div 
                            className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center border-2 shadow-sm"
                            style={{ borderColor: colors.border }}
                            title="Evaluador"
                          >
                            <User className="w-4 h-4" style={{ color: colors.text }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        ) : plan && pendingEvaluators > 0 ? (
          // CASO 2: HAY PLAN PENDIENTE SIN VOTOS - Mostrar matriz vacía con mensaje
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">Evaluación en Progreso</h3>
              <p className="text-sm text-blue-700 mt-1">
                {pendingEvaluators} {pendingEvaluators === 1 ? 'evaluador pendiente' : 'evaluadores pendientes'}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Las evaluaciones aparecerán en la matriz cuando sean completadas
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
            {["B3", "B2", "A", "C4", "B1", "B4", "C1", "C2", "C3"].map((code) => {
              const config = classificationMatrix[code];
              const colors = classificationColors[config.color];
              
              return (
                <div
                  key={code}
                  className="rounded-xl border-2 p-4 min-h-[200px] flex flex-col opacity-60"
                  style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                >
                  <div className="text-center mb-2">
                    <span className="text-2xl font-bold" style={{ color: colors.text }}>{code}</span>
                    <p className="text-xs font-medium" style={{ color: colors.text }}>{config.label}</p>
                    <p className="text-xs mt-1" style={{ color: colors.text }}>
                      V: {config.valores.min}-{config.valores.max}% | R: {config.resultados.min}-{config.resultados.max}%
                    </p>
                  </div>
                  
                  {/* Cuadrante vacío esperando evaluaciones */}
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xs" style={{ color: colors.text }}>Esperando...</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        ) : (
          // CASO 3: NO HAY PLAN NI EVALUACIONES
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <UserX className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                {selectedEmployee?.name} aún no ha sido evaluado
              </h3>
              <p className="text-slate-500">
                {isAdmin 
                  ? "Este empleado no tiene evaluaciones registradas todavía."
                  : "Nadie te ha evaluado aún. Las evaluaciones aparecerán aquí cuando tus compañeros completen sus valoraciones."
                }
              </p>
            </div>
          </div>
        )}

        {/* Evaluación Calculada y Autoevaluación */}
        {selectedEmployee && selectedResult && selectedResult.total_votos > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Evaluación Calculada (Promedio de otros) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Evaluación Calculada
              </h3>
              
              <div className="text-center mb-4">
                <div 
                  className="inline-block px-6 py-3 rounded-xl border-2"
                  style={{ 
                    backgroundColor: classificationColors[classificationMatrix[selectedResult.cuadrante_mayoria].color].bg,
                    borderColor: classificationColors[classificationMatrix[selectedResult.cuadrante_mayoria].color].border
                  }}
                >
                  <p className="text-4xl font-bold" style={{ 
                    color: classificationColors[classificationMatrix[selectedResult.cuadrante_mayoria].color].text 
                  }}>
                    {selectedResult.cuadrante_mayoria}
                  </p>
                  <p className="text-sm font-medium mt-1" style={{ 
                    color: classificationColors[classificationMatrix[selectedResult.cuadrante_mayoria].color].text 
                  }}>
                    {classificationMatrix[selectedResult.cuadrante_mayoria].label}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600">Valores</p>
                  <p className="text-2xl font-bold text-purple-900">{selectedResult.promedio_valores}%</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600">Resultados</p>
                  <p className="text-2xl font-bold text-blue-900">{selectedResult.promedio_resultados}%</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-3 text-center">
                Basado en {selectedResult.total_votos} evaluacion(es)
              </p>
            </div>

            {/* Autoevaluación */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Autoevaluación
              </h3>
              
              {autoevaluacion ? (
                <>
                  <div className="text-center mb-4">
                    <div 
                      className="inline-block px-6 py-3 rounded-xl border-2"
                      style={{ 
                        backgroundColor: classificationColors[classificationMatrix[autoevaluacion.cuadrante].color].bg,
                        borderColor: classificationColors[classificationMatrix[autoevaluacion.cuadrante].color].border
                      }}
                    >
                      <p className="text-4xl font-bold" style={{ 
                        color: classificationColors[classificationMatrix[autoevaluacion.cuadrante].color].text 
                      }}>
                        {autoevaluacion.cuadrante}
                      </p>
                      <p className="text-sm font-medium mt-1" style={{ 
                        color: classificationColors[classificationMatrix[autoevaluacion.cuadrante].color].text 
                      }}>
                        {classificationMatrix[autoevaluacion.cuadrante].label}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-purple-600">Valores</p>
                      <p className="text-2xl font-bold text-purple-900">{autoevaluacion.valores_score}%</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600">Resultados</p>
                      <p className="text-2xl font-bold text-blue-900">{autoevaluacion.resultados_score}%</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-sm">No hay autoevaluación registrada</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Tab: Planificación (solo admin)
  const PlanificacionTab = () => {
    const currentYear = new Date().getFullYear();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [filterPeriodo, setFilterPeriodo] = useState('all');
    const [filterYear, setFilterYear] = useState(currentYear.toString());
    const [newPlan, setNewPlan] = useState({
      employee_id: '',
      period: `Q1 ${currentYear}`,
      fecha_limite: '',
      evaluator_ids: []
    });

    // Obtener años únicos de los planes
    const yearsFromPlans = [...new Set(plans.map(p => {
      const match = p.period?.match(/\d{4}/);
      return match ? match[0] : null;
    }))].filter(Boolean);
    
    // Siempre incluir el año actual
    const availableYears = [...new Set([currentYear.toString(), ...yearsFromPlans])].sort((a, b) => b - a);

    // Filtrar planes por periodo y año
    const filteredPlans = plans.filter(plan => {
      const planYear = plan.period?.match(/\d{4}/)?.[0] || '';
      const planPeriod = plan.period?.match(/Q[1-4]/)?.[0] || '';
      
      const yearMatch = filterYear === 'all' || planYear === filterYear;
      const periodoMatch = filterPeriodo === 'all' || planPeriod === filterPeriodo;
      
      return yearMatch && periodoMatch;
    });

    const handleCreatePlan = async () => {
      try {
        await empleadoAAPI.createPlan(newPlan);
        setShowCreateForm(false);
        setNewPlan({ employee_id: '', period: `Q1 ${currentYear}`, fecha_limite: '', evaluator_ids: [] });
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
        {/* Filtros de Periodo y Año */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filtrar por Año
              </label>
              <select
                className="w-full border border-slate-300 rounded-lg px-4 py-2"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="all">Todos los años</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filtrar por Periodo
              </label>
              <select
                className="w-full border border-slate-300 rounded-lg px-4 py-2"
                value={filterPeriodo}
                onChange={(e) => setFilterPeriodo(e.target.value)}
              >
                <option value="all">Todos los periodos</option>
                <option value="Q1">Q1 (Enero - Marzo)</option>
                <option value="Q2">Q2 (Abril - Junio)</option>
                <option value="Q3">Q3 (Julio - Septiembre)</option>
                <option value="Q4">Q4 (Octubre - Diciembre)</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <div className="text-sm">
                <p className="text-slate-600 font-medium">Planes filtrados:</p>
                <p className="text-2xl font-bold text-blue-600">{filteredPlans.length}</p>
              </div>
            </div>
          </div>
        </div>

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
                  placeholder={`Q1 ${currentYear}`}
                  value={newPlan.period}
                  onChange={(e) => setNewPlan({...newPlan, period: e.target.value})}
                />
                <p className="text-xs text-slate-500 mt-1">Formato: Q1 {currentYear}, Q2 {currentYear}, etc.</p>
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
          {filteredPlans.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">No hay planes para este periodo/año</p>
              <p className="text-xs text-slate-400 mt-1">Ajusta los filtros o crea un nuevo plan</p>
            </div>
          ) : (
            filteredPlans.map(plan => (
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
            ))
          )}
        </div>
      </div>
    );
  };

  // Tab: Evaluar + Autoevaluación
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

    const handleSubmitAutoeval = async () => {
      if (!autoevalCuadrante) {
        alert('Por favor selecciona un cuadrante');
        return;
      }

      const config = classificationMatrix[autoevalCuadrante];
      const valoresScore = Math.round((config.valores.min + config.valores.max) / 2);
      const resultadosScore = Math.round((config.resultados.min + config.resultados.max) / 2);

      try {
        await empleadoAAPI.createAutoevaluacion({
          period: 'Q1 2024',
          cuadrante: autoevalCuadrante,
          valores_score: valoresScore,
          resultados_score: resultadosScore,
          comentarios: `Autoevaluación - ${config.label}`
        });
        alert('Autoevaluación guardada exitosamente');
        setShowAutoevalForm(false);
        setAutoevalCuadrante(null);
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

    if (showAutoevalForm) {
      return (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-2">
              Autoevaluación
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Haz clic en el cuadrante donde te clasificarías
            </p>

            {/* Grid Visual Clickeable */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {["B3", "B2", "A", "C4", "B1", "B4", "C1", "C2", "C3"].map((code) => {
                const config = classificationMatrix[code];
                const colors = classificationColors[config.color];
                const isSelected = autoevalCuadrante === code;

                return (
                  <button
                    key={code}
                    onClick={() => setAutoevalCuadrante(code)}
                    className={`rounded-xl border-2 p-6 min-h-[120px] flex flex-col items-center justify-center cursor-pointer transition-all ${
                      isSelected ? 'ring-4 ring-green-500 scale-105' : 'hover:scale-102'
                    }`}
                    style={{ 
                      backgroundColor: colors.bg, 
                      borderColor: isSelected ? '#10b981' : colors.border 
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

            {autoevalCuadrante && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="font-medium text-green-900">Seleccionaste: {classificationMatrix[autoevalCuadrante].label}</p>
                <p className="text-sm text-green-700 mt-1">{classificationMatrix[autoevalCuadrante].description}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmitAutoeval}
                disabled={!autoevalCuadrante}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Guardar Autoevaluación
              </button>
              <button
                onClick={() => {
                  setShowAutoevalForm(false);
                  setAutoevalCuadrante(null);
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

    // Listado de evaluaciones pendientes + autoevaluación
    return (
      <div className="space-y-6">
        {/* Sección de Autoevaluación */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-green-900">Autoevaluación</h3>
              <p className="text-sm text-green-700 mt-1">
                Evalúate a ti mismo. Esta evaluación no se incluye en el cálculo, es solo para comparación.
              </p>
            </div>
            <button
              onClick={() => setShowAutoevalForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              {autoevaluacion ? 'Actualizar' : 'Autoevaluarme'}
            </button>
          </div>
        </div>

        {/* Evaluaciones Pendientes */}
        {pendingEvaluations.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="text-slate-600">No tienes evaluaciones pendientes</p>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-medium text-blue-900">Evaluaciones Pendientes</h3>
              <p className="text-sm text-blue-700 mt-1">
                Tienes {pendingEvaluations.length} evaluación(es) pendiente(s). Haz clic en "Evaluar" para clasificar al colaborador.
              </p>
            </div>

            <div className="space-y-4">
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
          </>
        )}
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
