import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiError, api, setToken, getToken } from "../API";

const AuthContext = createContext({
  user: null,
  loggedIn: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const { user: nextUser } = await api.get("/auth/me");
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setToken(null);
      }
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const adoptSession = ({ token, user: nextUser }) => {
    setToken(token);
    setUser(nextUser);
    setLoading(false);
    return nextUser;
  };

  const login = useCallback(async (email, password) => {
    const session = await api.post("/auth/login", { email, password });
    return adoptSession(session);
  }, []);

  const register = useCallback(async (email, password) => {
    const session = await api.post("/auth/register", { email, password });
    return adoptSession(session);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loggedIn: !!user,
      loading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;