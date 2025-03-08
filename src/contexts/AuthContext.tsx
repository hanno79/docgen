import React, { createContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Beim Laden der Anwendung prüfen, ob ein Benutzer im localStorage gespeichert ist
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    // Für Entwicklungszwecke: Automatische Anmeldung
    if (!storedUser) {
      const devUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      };
      localStorage.setItem('user', JSON.stringify(devUser));
      setUser(devUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // In einer echten Anwendung würde hier die API-Anfrage stehen
    const mockUser = {
      id: '1',
      name: 'Test User',
      email
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (name: string, email: string, password: string) => {
    // In einer echten Anwendung würde hier die API-Anfrage stehen
    const mockUser = {
      id: Date.now().toString(),
      name,
      email
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
