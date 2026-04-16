import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { pdiAPI } from '../services/api';
import { Target, Plus, Trash2, Calendar, BookOpen, Users, TrendingUp } from 'lucide-react';

const PDIView = ({ isAdmin }) => {
  const { user } = useAuth();
  const [pdis, setPdis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPDI, setNewPDI] = useState({
    employeeId: user?.employee_id || '',
    period: 'Q1 2024',
    objetivos: [{objetivo: '', plazo: '', progreso: 0}],
    aprendizajeFormal: '',
    aprendizajeInformal: '',
    mentorias: ''
  });

  useEffect(() => {
    fetchPDIs();
  }, []);

  const fetchPDIs = async () => {
    try {
      setLoading(true);
      const data = isAdmin 
        ? await pdiAPI.getAll()
        : await pdiAPI.getMyPDI();
      setPdis(Array.isArray(data) ? data : [data].filter(Boolean));
    } catch (error) {
      console.error('Error fetching PDIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePDI = async () => {
    try {
      await pdiAPI.create(newPDI);
      setShowCreateForm(false);
      setNewPDI({
        employeeId: user?.employee_id || '',
        period: 'Q1 2024',
        objetivos: [{objetivo: '', plazo: '', progreso: 0}],
        aprendizajeFormal: '',
        aprendizajeInformal: '',
        mentorias: ''
      });
      fetchPDIs();
    } catch (error) {
      alert('Error al crear PDI: ' + error.message);
    }
  };

  const addObjetivo = () => {
    setNewPDI({
      ...newPDI,
      objetivos: [...newPDI.objetivos, {objetivo: '', plazo: '', progreso: 0}]
    });
  };

  const updateObjetivo = (index, field, value) => {
    const updated = [...newPDI.objetivos];
    updated[index][field] = value;
    setNewPDI({...newPDI, objetivos: updated});
  };

  const removeObjetivo = (index) => {
    setNewPDI({
      ...newPDI,
      objetivos: newPDI.objetivos.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p>Cargando...</p></div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
          Plan de Desarrollo Individual (PDI)
        </h1>
        <p className="text-slate-500 mt-1">Define y da seguimiento a tus objetivos de desarrollo profesional</p>
      </div>

      {/* Header con botón crear */}
      {!showCreateForm && (
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-6"
        >
          <Plus className="w-4 h-4" />
          Crear Nuevo PDI
        </button>
      )}

      {/* Formulario de creación */}
      {showCreateForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">Nuevo Plan de Desarrollo</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Periodo</label>
              <input
                type="text"
                className="w-full border border-slate-300 rounded-lg px-4 py-2"
                placeholder="Q1 2024"
                value={newPDI.period}
                onChange={(e) => setNewPDI({...newPDI, period: e.target.value})}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Objetivos de Desarrollo</label>
                <button
                  onClick={addObjetivo}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Agregar Objetivo
                </button>
              </div>

              {newPDI.objetivos.map((obj, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg p-3 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Objetivo {idx + 1}</span>
                    {newPDI.objetivos.length > 1 && (
                      <button
                        onClick={() => removeObjetivo(idx)}
                        className="text-red-500 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-2"
                    placeholder="Describe el objetivo..."
                    value={obj.objetivo}
                    onChange={(e) => updateObjetivo(idx, 'objetivo', e.target.value)}
                  />

                  <input
                    type="text"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    placeholder="Plazo (ej: 3 meses)"
                    value={obj.plazo}
                    onChange={(e) => updateObjetivo(idx, 'plazo', e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Aprendizaje Formal</label>
              <textarea
                className="w-full border border-slate-300 rounded-lg px-4 py-2"
                rows="3"
                placeholder="Cursos, certificaciones, talleres..."
                value={newPDI.aprendizajeFormal}
                onChange={(e) => setNewPDI({...newPDI, aprendizajeFormal: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Aprendizaje Informal</label>
              <textarea
                className="w-full border border-slate-300 rounded-lg px-4 py-2"
                rows="3"
                placeholder="Lecturas, proyectos, autoaprendizaje..."
                value={newPDI.aprendizajeInformal}
                onChange={(e) => setNewPDI({...newPDI, aprendizajeInformal: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mentorías</label>
              <textarea
                className="w-full border border-slate-300 rounded-lg px-4 py-2"
                rows="2"
                placeholder="Mentores, coaches, asesores..."
                value={newPDI.mentorias}
                onChange={(e) => setNewPDI({...newPDI, mentorias: e.target.value})}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreatePDI}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Crear PDI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de PDIs */}
      <div className="space-y-4">
        {pdis.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <Target className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500">No hay PDIs creados</p>
          </div>
        ) : (
          pdis.map((pdi) => (
            <div key={pdi.id} className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{pdi.employeeName}</h3>
                  <p className="text-sm text-slate-500">Periodo: {pdi.period}</p>
                </div>
                <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  {pdi.status || 'En Progreso'}
                </span>
              </div>

              {/* Objetivos */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Objetivos de Desarrollo
                </h4>
                <div className="space-y-2">
                  {pdi.objetivos?.map((obj, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm font-medium text-slate-900">{obj.objetivo}</p>
                        <span className="text-xs text-slate-500">{obj.plazo}</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-600">Progreso</span>
                          <span className="font-medium">{obj.progreso || 0}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${obj.progreso || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aprendizajes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <p className="text-xs font-semibold text-blue-900">Formal</p>
                  </div>
                  <p className="text-xs text-blue-700">{pdi.aprendizajeFormal || 'N/A'}</p>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <p className="text-xs font-semibold text-purple-900">Informal</p>
                  </div>
                  <p className="text-xs text-purple-700">{pdi.aprendizajeInformal || 'N/A'}</p>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-orange-600" />
                    <p className="text-xs font-semibold text-orange-900">Mentorías</p>
                  </div>
                  <p className="text-xs text-orange-700">{pdi.mentorias || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PDIView;
