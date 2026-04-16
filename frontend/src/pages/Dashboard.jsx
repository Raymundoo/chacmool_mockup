import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Award, Star, AlertTriangle, Link } from 'lucide-react';
import { employeesAPI, empleadoAAPI } from '../services/api';
import { classificationMatrix, classificationColors, getClassification } from '../utils/classifications';

const Dashboard = ({ isAdmin }) => {
  const currentYear = new Date().getFullYear();
  const [employees, setEmployees] = useState([]);
  const [empleadoAResults, setEmpleadoAResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState(currentYear.toString());
  const [filterPeriod, setFilterPeriod] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesData, resultsData] = await Promise.all([
          employeesAPI.getAll(),
          empleadoAAPI.getAllResults().catch(() => [])
        ]);
        setEmployees(employeesData);
        setEmpleadoAResults(resultsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Cargando...</div>
      </div>
    );
  }

  // Filtrar resultados por año y periodo
  const filteredResults = empleadoAResults.filter(result => {
    // Aquí asumimos que los resultados tienen un campo 'period' como "Q1 2025"
    // Si no existe, necesitarás obtenerlo del plan asociado
    const resultPeriod = result.period || '';
    const resultYear = resultPeriod.match(/\d{4}/)?.[0] || '';
    const resultQuarter = resultPeriod.match(/Q[1-4]/)?.[0] || '';
    
    const yearMatch = filterYear === 'all' || resultYear === filterYear;
    const periodMatch = filterPeriod === 'all' || resultQuarter === filterPeriod;
    
    return yearMatch && periodMatch;
  });

  // Calcular valores promedio desde los resultados filtrados
  const avgValores = filteredResults.length > 0 
    ? Math.round(filteredResults.reduce((a, r) => a + (r.promedio_valores || 0), 0) / filteredResults.length)
    : 0;
  const avgResultados = filteredResults.length > 0
    ? Math.round(filteredResults.reduce((a, r) => a + (r.promedio_resultados || 0), 0) / filteredResults.length)
    : 0;
  
  // Contar empleados por clasificación usando resultados filtrados
  const topPerformers = filteredResults.filter(r => r.cuadrante_mayoria === "A").length;
  
  const needsAttention = filteredResults.filter(r => 
    ["C1", "C2", "C3"].includes(r.cuadrante_mayoria)
  ).length;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>Dashboard</h1>
        <p className="text-slate-500 mt-1">Resumen de evaluaciones 360°</p>
      </div>

      {/* Filtros de Año y Periodo */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
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
              <option value={currentYear}>{currentYear}</option>
              <option value={currentYear - 1}>{currentYear - 1}</option>
              <option value={currentYear - 2}>{currentYear - 2}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filtrar por Periodo
            </label>
            <select
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
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
              <p className="text-slate-600 font-medium">Evaluaciones filtradas:</p>
              <p className="text-2xl font-bold text-blue-600">{filteredResults.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <Users className="w-5 h-5 text-slate-400 mb-2" />
          <p className="text-sm text-slate-500">Empleados</p>
          <p className="text-3xl font-bold text-slate-900">{employees.length}</p>
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
              const count = filteredResults.filter(r => r.cuadrante_mayoria === code).length;
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
                <Award className="w-5 h-5 text-blue-600" />
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

export default Dashboard;
