// src\services\authService.js

import api from '../api/api';

const API_URL = process.env.REACT_APP_API_URL + '/auth';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post(`${API_URL}/login`, { username, password });
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) throw new Error('Usuário ou senha inválidos.');
        throw new Error(error.response.data?.erro || 'Erro no servidor.');
      }
      throw new Error(error.request ? 'Sem resposta do servidor.' : 'Falha na comunicação.');
    }
  },

  definirSenhaPermanente: async (novaSenha) => {
    const response = await api.post(`${API_URL}/definir-senha-permanente`, { novaSenha });
    return response.data;
  },

  getAll: async (token, empresaId = null) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const params = empresaId ? new URLSearchParams({ empresaId }) : '';
    const response = await fetch(`${API_URL}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) throw new Error("Token de autenticação expirado.");
    
    const result = await response.json();
    if (!response.ok) throw new Error(result.erro || 'Falha ao buscar usuários.');    
    return result.sucesso ? result.dados : result;
  },

  getAllPaged: async (token, filters) => {
    if (!token) throw new Error("Token não fornecido.");

    const queryParams = new URLSearchParams(filters);
    
    const response = await fetch(`${API_URL}/paginado?${queryParams.toString()}`, {
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

  create: async (authData, token) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const response = await fetch(`${API_URL}/criar-usuario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(authData)
    });

    if (response.status === 401) throw new Error("Token de autenticação expirado.");
    
    const result = await response.json();
    if (!response.ok) throw new Error(result.erro || 'Falha ao criar o usuário.');
    
    return result.dados;
  },

  update: async (authData, token) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const response = await fetch(`${API_URL}/${authData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(authData)
    });

    if (response.status === 401) throw new Error("Token de autenticação expirado.");
    
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.erro || 'Falha ao atualizar o usuário.');
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
      throw new Error(result.erro || 'Falha ao deletar o usuário.');
    }
  }
};