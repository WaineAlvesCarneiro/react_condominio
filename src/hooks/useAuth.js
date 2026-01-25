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
        if (decodedToken.exp * 1000 > Date.now()) {
          return { ...decodedToken, token: storedToken, username: decodedToken.unique_name };
        }
      }
      return null;
    } catch (error) {
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

      setUser({ ...decodedToken, token, username: decodedToken.unique_name });

    } catch (error) {
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