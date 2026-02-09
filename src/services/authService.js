// src\services\authService.js

import api from '../api/api';

const API_URL = process.env.REACT_APP_API_URL;

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username: username,
        password: password
      });

      return response.data;

    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Usuário ou senha inválidos.');
        } else {
          throw new Error(error.response.data.erro);
        }
      } else if (error.request) {
        throw new Error('Sem resposta do servidor. Verifique sua conexão.');
      } else {
        throw new Error('Falha na comunicação. Tente novamente mais tarde.');
      }
    }
  },

  definirSenhaPermanente: async (novaSenha) => {
    const response = await api.post('/auth/definir-senha-permanente', { novaSenha });
    return response.data;
  },

  getAll: async (token, empresaId = null) => {
    if (!token) {
      throw new Error("Token de autenticação não fornecido.");
    }

    const queryParams = new URLSearchParams({
      empresaId
    });

    if (empresaId) {
        queryParams.append('empresaId', empresaId.toString());
    }

    const url = `${API_URL}/auth?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      throw new Error("Token de autenticação expirado.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ erro: 'Falha ao buscar usuários.' }));
      throw new Error(errorData.erro);
    }

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      throw new Error(result.erro || 'Erro desconhecido na API.');
    }
  },

  getAllPaged: async (token, page = 1, pageSize = 10, sortBy = 'Id', sortDescending = 'ASC', empresaId = null) => {
    if (!token) throw new Error("Token de autenticação não fornecido.");

    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy,
      sortDescending: sortDescending,
    };

    if (empresaId !== null && empresaId !== undefined) {
      params.empresaId = empresaId.toString();
    }

    const queryParams = new URLSearchParams(params);
    const url = `${API_URL}/auth/paginado?${queryParams.toString()}`;

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

  create: async (authData, token) => {
    if (!token) {
      throw new Error("Token de autenticação não fornecido.");
    }

    const response = await fetch(`${API_URL}/auth/criar-usuario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(authData)
    });

    if (response.status === 401) {
      throw new Error("Token de autenticação expirado.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ erro: 'Falha ao criar o usuário.' }));
      throw new Error(errorData.erro || 'Falha ao criar o usuário.');
    }

    const result = await response.json();
    return result.dados;
  },

  update: async (authData, token) => {
    if (!token) {
      throw new Error("Token de autenticação não fornecido.");
    }

    const response = await fetch(`${API_URL}/auth/${authData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(authData)
    });

    if (response.status === 401) {
      throw new Error("Token de autenticação expirado.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ erro: 'Falha ao atualizar o usuário.' }));
      throw new Error(errorData.erro || 'Falha ao atualizar o usuário.');
    }
  },

  delete: async (id, token) => {
    if (!token) {
      throw new Error("Token de autenticação não fornecido.");
    }

    const response = await fetch(`${API_URL}/auth/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      throw new Error("Token de autenticação expirado.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ erro: 'Falha ao deletar o usuário.' }));
      throw new Error(errorData.erro || 'Falha ao deletar o usuário.');
    }
  }
};