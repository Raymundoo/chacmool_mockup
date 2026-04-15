// Classification Matrix - Sistema de clasificación "Empleado A"
export const classificationMatrix = {
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
    shortDesc: "Bajo en ambos",
    description: "Ni valores ni resultados. Requiere plan de acción inmediato.",
    color: "red-light",
    action: "Plan de mejora de 90 días o desvinculación"
  },
  "C1": { 
    valores: { min: 0, max: 60 }, 
    resultados: { min: 0, max: 60 },
    label: "Acción Urgente", 
    shortDesc: "Crítico",
    description: "Ni valores ni resultados. Acción inmediata.",
    color: "red",
    action: "Acción correctiva inmediata"
  }
};

export const classificationColors = {
  "green": { bg: "#d1fae5", border: "#10b981", text: "#047857" },
  "yellow": { bg: "#fef3c7", border: "#f59e0b", text: "#d97706" },
  "yellow-light": { bg: "#fef9c3", border: "#eab308", text: "#a16207" },
  "orange": { bg: "#fed7aa", border: "#f97316", text: "#c2410c" },
  "red": { bg: "#fee2e2", border: "#ef4444", text: "#b91c1c" },
  "red-light": { bg: "#fecaca", border: "#f87171", text: "#dc2626" }
};

export const getClassification = (valoresScore, resultadosScore) => {
  for (const [code, config] of Object.entries(classificationMatrix)) {
    if (
      valoresScore >= config.valores.min &&
      valoresScore <= config.valores.max &&
      resultadosScore >= config.resultados.min &&
      resultadosScore <= config.resultados.max
    ) {
      return { code, ...config };
    }
  }
  return { code: "C1", ...classificationMatrix["C1"] };
};
