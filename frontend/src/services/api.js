const API_URL = process.env.REACT_APP_BACKEND_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Employees API
export const employeesAPI = {
  getAll: async (department = null) => {
    const url = department && department !== 'all' 
      ? `${API_URL}/api/employees?department=${department}`
      : `${API_URL}/api/employees`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
  },

  getOne: async (id) => {
    const response = await fetch(`${API_URL}/api/employees/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch employee');
    return response.json();
  },

  create: async (data) => {
    const response = await fetch(`${API_URL}/api/employees`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create employee');
    return response.json();
  },

  update: async (id, data) => {
    const response = await fetch(`${API_URL}/api/employees/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update employee');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/api/employees/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete employee');
    return response.json();
  }
};

// Aciertos y Desaciertos API
export const aciertosAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.month && filters.month !== 'all') params.append('month', filters.month);
    if (filters.year && filters.year !== 'all') params.append('year', filters.year);
    if (filters.department && filters.department !== 'all') params.append('department', filters.department);
    if (filters.employee_id && filters.employee_id !== 'all') params.append('employee_id', filters.employee_id);
    
    const url = `${API_URL}/api/aciertos-desaciertos${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch evaluations');
    return response.json();
  },

  getOne: async (id) => {
    const response = await fetch(`${API_URL}/api/aciertos-desaciertos/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch evaluation');
    return response.json();
  },

  create: async (data) => {
    const response = await fetch(`${API_URL}/api/aciertos-desaciertos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create evaluation');
    return response.json();
  },

  update: async (id, data) => {
    const response = await fetch(`${API_URL}/api/aciertos-desaciertos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update evaluation');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/api/aciertos-desaciertos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete evaluation');
    return response.json();
  }
};
