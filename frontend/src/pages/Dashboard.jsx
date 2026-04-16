import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Award, Star, AlertTriangle, Link } from 'lucide-react';
import { employeesAPI, empleadoAAPI } from '../services/api';
import { classificationMatrix, classificationColors, getClassification } from '../utils/classifications';

const Dashboard = ({ isAdmin }) => {
  const [employees, setEmployees] = useState([]);
  const [empleadoAResults, setEmpleadoAResults] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Calcular valores promedio desde los resultados de Empleado A
  const avgValores = empleadoAResults.length > 0 
    ? Math.round(empleadoAResults.reduce((a, r) => a + (r.promedio_valores || 0), 0) / empleadoAResults.length)
    : 0;
  const avgResultados = empleadoAResults.length > 0
    ? Math.round(empleadoAResults.reduce((a, r) => a + (r.promedio_resultados || 0), 0) / empleadoAResults.length)
    : 0;
  
  // Contar empleados por clasificación usando resultados de Empleado A
  const topPerformers = empleadoAResults.filter(r => r.cuadrante_mayoria === "A").length;
  
  const needsAttention = empleadoAResults.filter(r => 
    ["C1", "C2", "C3"].includes(r.cuadrante_mayoria)
  ).length;

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
              const count = empleadoAResults.filter(r => r.cuadrante_mayoria === code).length;
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
