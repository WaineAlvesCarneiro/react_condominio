// src\services\moradorService.js

const API_URL = process.env.REACT_APP_API_URL;

const moradorService = {
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

    const url = `${API_URL}/morador?${queryParams.toString()}`;

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
      const errorData = await response.json().catch(() => ({ erro: 'Falha ao buscar moradores.' }));
      throw new Error(errorData.erro);
    }

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      throw new Error(result.erro || 'Erro desconhecido na API.');
    }
  },

  getAllPaged: async (token, page = 0, linesPerPage = 10, orderBy = 'Id', direction = 'ASC', empresaId = null) => {
    if (!token) {
      throw new Error("Token de autenticação não fornecido.");
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      linesPerPage: linesPerPage.toString(),
      orderBy,
      direction,
      empresaId
    });

    if (empresaId) {
        queryParams.append('empresaId', empresaId.toString());
    }
    const url = `${API_URL}/morador/paginado?${queryParams.toString()}`;

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
      const errorData = await response.json().catch(() => ({ erro: 'Falha ao buscar moradores paginados.' }));
      throw new Error(errorData.erro);
    }

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      throw new Error(result.erro || 'Erro desconhecido na API.');
    }
  },

  create: async (moradorData, token) => {
    if (!token) {
      throw new Error("Token de autenticação não fornecido.");
    }

    const response = await fetch(`${API_URL}/morador`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(moradorData)
    });

    if (response.status === 401) {
      throw new Error("Token de autenticação expirado.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ erro: 'Falha ao criar o imóvel.' }));
      throw new Error(errorData.erro || 'Falha ao criar o morador.');
    }

    const result = await response.json();
    return result.dados;
  },

  update: async (moradorData, token) => {
    if (!token) {
      throw new Error("Token de autenticação não fornecido.");
    }

    const response = await fetch(`${API_URL}/morador/${moradorData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(moradorData)
    });

    if (response.status === 401) {
      throw new Error("Token de autenticação expirado.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ erro: 'Falha ao atualizar o imóvel.' }));
      throw new Error(errorData.erro || 'Falha ao atualizar o morador.');
    }
  },

  delete: async (id, token) => {
    if (!token) {
      throw new Error("Token de autenticação não fornecido.");
    }

    const response = await fetch(`${API_URL}/morador/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      throw new Error("Token de autenticação expirado.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ erro: 'Falha ao deletar o imóvel.' }));
      throw new Error(errorData.erro || 'Falha ao deletar o morador.');
    }
  }
};

export default moradorService;