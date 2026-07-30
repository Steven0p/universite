import { createContext, useContext, useState } from 'react';
import { authApi } from '../services/api.js';

const AuthContext = createContext(null);

function lireUtilisateurStocke() {
  try {
    const brut = localStorage.getItem('utilisateur');
    return brut ? JSON.parse(brut) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(lireUtilisateurStocke());

  const login = async (email, motDePasse) => {
    const data = await authApi.login({ email, motDePasse });
    localStorage.setItem('token', data.token);
    localStorage.setItem('utilisateur', JSON.stringify(data.utilisateur));
    setUtilisateur(data.utilisateur);
    return data.utilisateur;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
    setUtilisateur(null);
  };

  return (
    <AuthContext.Provider value={{ utilisateur, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider.');
  return ctx;
}
