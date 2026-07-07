import { createContext, ReactNode, useContext, useState } from "react";

interface UserContextValue {
  isAdmin: boolean;
  isAuth: boolean;
  setIsAdmin: (value: boolean) => void;
  setIsAuth: (value: boolean) => void;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({children}: {children:ReactNode}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  return (
    <UserContext.Provider value={{ isAdmin, isAuth, setIsAdmin, setIsAuth }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return context; 
}