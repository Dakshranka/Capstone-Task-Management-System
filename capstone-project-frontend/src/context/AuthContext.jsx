import { createContext, useEffect, useMemo, useState } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(authService.getStoredUser());
  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (!token || user) return;

    const userFromToken = authService.buildUserFromToken(token);
    setUser(userFromToken);
    authService.saveAuth(token, userFromToken);
  }, [token, user]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      const userFromToken = authService.buildUserFromToken(response.token);

      authService.saveAuth(response.token, userFromToken);
      setToken(response.token);
      setUser(userFromToken);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const response = await authService.register(payload);
      const userFromToken = authService.buildUserFromToken(response.token);

      authService.saveAuth(response.token, userFromToken);
      setToken(response.token);
      setUser(userFromToken);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.clearAuth();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
    }),
    [user, token, loading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
