import { useState, createContext, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedToken = sessionStorage.getItem('token');
      if (storedToken) {
        const decodedToken = jwtDecode(storedToken);
        // Verifica se o token ainda é válido antes de carregar o usuário
        if (decodedToken.exp * 1000 > Date.now()) {
          return { ...decodedToken, token: storedToken };
        }
      }
      return null;
    } catch (error) {
      //console.error("Failed to parse token from sessionStorage:", error);
      return null;
    }
  });

  useEffect(() => {
    if (user && user.token) {
      sessionStorage.setItem('token', user.token);
    } else {
      sessionStorage.removeItem('token');
    }
  }, [user]);

  const login = async (username, password) => {
    try {
      const userData = await authService.login(username, password);

      const token = userData.token;
      const decodedToken = jwtDecode(token);

      setUser({ ...decodedToken, token, username });

    } catch (error) {
      // O throw error; é fundamental para que o componente de login possa capturar a mensagem e exibir na tela
      //console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('token');
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};