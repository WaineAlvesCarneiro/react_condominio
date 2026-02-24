// src\services\empresaService.js

const API_URL = process.env.REACT_APP_API_URL;

const empresaService = {
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

    const url = `${API_URL}/empresa?${queryParams.toString()}`;

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
      const errorData = await response.json().catch(() => ({ erro: 'Falha ao buscar empresas.' }));
      throw new Error(errorData.erro);
    }

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      throw new Error(result.erro || 'Erro desconhecido na API.');
    }
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
    const url = `${API_URL}/empresa/paginado?${queryParams.toString()}`;

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

  create: async (empresaData, token) => {
    if (!token) {
      throw new Error("Token de autenticação não fornecido.");
    }

    const response = await fetch(`${API_URL}/empresa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(empresaData)
    });

    if (response.status === 401) {
      throw new Error("Token de autenticação expirado.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ erro: 'Falha ao criar o empresa.' }));
      throw new Error(errorData.erro || 'Falha ao criar o empresa.');
    }

    const result = await response.json();
    return result.dados;
  },

  update: async (empresaData, token) => {
    if (!token) {
      throw new Error("Token de autenticação não fornecido.");
    }

    const response = await fetch(`${API_URL}/empresa/${empresaData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(empresaData)
    });

    if (response.status === 401) {
      throw new Error("Token de autenticação expirado.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ erro: 'Falha ao atualizar o empresa.' }));
      throw new Error(errorData.erro || 'Falha ao atualizar o empresa.');
    }
  },

  delete: async (id, token) => {
    if (!token) {
      throw new Error("Token de autenticação não fornecido.");
    }

    const response = await fetch(`${API_URL}/empresa/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      throw new Error("Token de autenticação expirado.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ erro: 'Falha ao deletar o empresa.' }));
      throw new Error(errorData.erro || 'Falha ao deletar o empresa.');
    }
  }
};

export default empresaService;