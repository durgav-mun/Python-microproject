const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiService = {
  // Sensor endpoints
  getSensorData: async () => {
    const response = await fetch(`${API_BASE_URL}/sensors/current`);
    return response.json();
  },

  // Nozzle endpoints
  getNozzles: async () => {
    const response = await fetch(`${API_BASE_URL}/nozzles`);
    return response.json();
  },

  getNozzleById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/nozzles/${id}`);
    return response.json();
  },

  createNozzle: async (nozzleData) => {
    const response = await fetch(`${API_BASE_URL}/nozzles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nozzleData),
    });
    return response.json();
  },

  // Flow endpoints
  getFlowData: async () => {
    const response = await fetch(`${API_BASE_URL}/flow/current`);
    return response.json();
  },

  // Vector endpoints
  calculateVectors: async (parameters) => {
    const response = await fetch(`${API_BASE_URL}/vectors/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parameters),
    });
    return response.json();
  },
};

export default apiService;
