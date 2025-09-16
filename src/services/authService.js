// src\services\authService.js

import api from '../api/api';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/Auth/login', {
        username: username,
        password: password
      });

      return response.data;

    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        if (status === 401) {
          throw new Error('Usuário ou senha inválidos.');
        } else {
          throw new Error(errorData.title || 'Erro na requisição. Tente novamente.');
        }
      } else if (error.request) {
        throw new Error('Sem resposta do servidor. Verifique sua conexão.');
      } else {
        throw new Error('Falha na comunicação. Tente novamente mais tarde.');
      }
    }
  },
};