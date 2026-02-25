// src\services\empresaService.js

const API_URL = process.env.REACT_APP_API_URL + '/empresa';

const empresaService = {
  getAll: async (token, empresaId = null) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const params = {};
    if (empresaId) params.empresaId = empresaId.toString();
    
    const queryParams = new URLSearchParams(params);
    const url = `${API_URL}?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) throw new Error("Token de autenticação expirado.");

    const result = await response.json();
    if (result.sucesso) return result.dados;
    throw new Error(result.erro || 'Erro desconhecido na API.');
  },

  getAllPaged: async (token, page = 1, pageSize = 10, sortBy = 'Id', sortDescending = 'ASC') => {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy,
      sortDescending: sortDescending,
    };
    const queryParams = new URLSearchParams(params);
    const url = `${API_URL}/paginado?${queryParams.toString()}`; 

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    return result.sucesso ? result.dados : Promise.reject(result.erro);
  },

  getById: async (id, token) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) throw new Error("Token de autenticação expirado.");
    if (response.status === 404) return null;

    const result = await response.json();
    return result.sucesso ? result.dados : Promise.reject(result.erro);
  },

  create: async (empresaData, token) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(empresaData)
    });

    if (response.status === 401) throw new Error("Token de autenticação expirado.");

    const result = await response.json();
    if (!response.ok) throw new Error(result.erro || 'Falha ao criar o imóvel.');
    return result.dados;
  },

  update: async (empresaData, token) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const response = await fetch(`${API_URL}/${empresaData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(empresaData)
    });

    if (response.status === 401) throw new Error("Token de autenticação expirado.");

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.erro || 'Falha ao atualizar o imóvel.');
    }
  },

  delete: async (id, token) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) throw new Error("Token de autenticação expirado.");

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.erro || 'Falha ao deletar o imóvel.');
    }
  }
};

export default empresaService;