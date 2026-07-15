import { createContext, useState, ReactNode, useContext } from 'react';
import { useLocalStorage } from '../Hooks/useLocalStorage';

interface UserData {
  name: string;
  email: string;
  bio: string;
}

interface UserContextValue {
  isAdmin: boolean;
  isAuth: boolean;
  userData: UserData | null;
  setIsAdmin: (value: boolean) => void;
  setIsAuth: (value: boolean) => void;
  setUserData: (data: UserData) => void;
  logout: () => void;
  loadUserData: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useLocalStorage<string | null>('token', null);
  const [userData, setUserData] = useLocalStorage<UserData | null>('userData', null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const isAuth = token !== null;

  const loadUserData = () => {
  const saved = localStorage.getItem('userData');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      setUserData(data);
    } catch {
      setUserData(null);
    }
  } 
};

  const setIsAuth = (value: boolean) => {
    if (value) {
      setToken('fake-token-123');
      loadUserData();
    } else {
      setToken(null);
    }
  };

  const logout = () => {
    setToken(null);
    setIsAdmin(false);
    // 🔹 userData остаётся в localStorage и контексте!
  };

  return (
    <UserContext.Provider value={{ 
      isAdmin, 
      isAuth, 
      userData,
      setIsAdmin, 
      setIsAuth, 
      setUserData,
      logout,
      loadUserData
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return context;
}