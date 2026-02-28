import { useState, useEffect, useContext, createContext } from 'react';
import PocketBase from 'pocketbase';
import { pb } from '../lib/pocketbase'; // Assuming pb is initialized here

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.isValid ? pb.authStore.model : null);
    }, true);

    // Initial check
    setUser(pb.authStore.isValid ? pb.authStore.model : null);
    setLoading(false);

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      setUser(authData.record);
      return authData.record;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, passwordConfirm) => {
    setLoading(true);
    try {
      const record = await pb.collection('users').create({
        email,
        password,
        passwordConfirm,
      });
      // Optionally log in the user immediately after registration
      await login(email, password);
      return record;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};