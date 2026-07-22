import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    // Stelle sicher dass User eine Rolle hat
    const userWithRole = {
      ...userData,
      role: userData.role || 'patient', // Default: patient
    };
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userWithRole));
    setUser(userWithRole);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('auth_token');
  };

  const isArzt = () => {
    return user?.role === 'arzt' || user?.role === 'ROLE_DOCTOR';
  };

  const isPatient = () => {
    return user?.role === 'patient' || user?.role === 'ROLE_PATIENT';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      isArzt, 
      isPatient, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};