import PropTypes from 'prop-types';
import { createContext, useCallback, useMemo, useState } from 'react';
import { getProfile, loginRequest, logoutRequest, refreshTokenRequest, googleLoginRequest } from '../services/authService.js';

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isBootstrapped, setBootstrapped] = useState(false);

  const bootstrap = useCallback(async () => {
    try {
      const data = await getProfile();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setBootstrapped(true);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await loginRequest(credentials);
    setUser(data.user);
    return data;
  }, []);

  const refresh = useCallback(async () => {
    const data = await refreshTokenRequest();
    if (data?.user) {
      setUser(data.user);
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    const data = await googleLoginRequest(credential);
    setUser(data.user);
    return data;
  }, []);

  const value = useMemo(() => ({
    user,
    isBootstrapped,
    bootstrap,
    login,
    logout,
    refresh,
    loginWithGoogle
  }), [user, isBootstrapped, bootstrap, login, logout, refresh, loginWithGoogle]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthProvider;
