import { createContext, useState, ReactNode, useContext } from "react";
import { useLocalStorage } from "../Hooks/useLocalStorage";

interface UserData {
  _id?: number;
  name: string;
  email: string;
  bio: string;
  avatar?: string | null;
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
  const [userData, setUserData] = useLocalStorage<UserData | null>(
    "userData",
    null,
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuth, setIsAuthState] = useState(() => {
    return localStorage.getItem("token") !== null;
  });

  const loadUserData = () => {
    const saved = localStorage.getItem("userData");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUserData({
          _id: data._id || 1,
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
          avatar: data.avatar || null,
        });
      } catch {
        setUserData(null);
      }
    }
  };

  const setIsAuth = (value: boolean) => {
    if (value) {
      const saved = localStorage.getItem("userData");
      let token = "mock-token-1";

      if (saved) {
        try {
          const user = JSON.parse(saved);
          token = `mock-token-${user._id || 1}`;
        } catch {}
      }
      localStorage.setItem("token", token);
      setIsAuthState(true);
      loadUserData();
    } else {
      localStorage.removeItem("token");
      setIsAuthState(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthState(false);
    setIsAdmin(false);
  };

  return (
    <UserContext.Provider
      value={{
        isAdmin,
        isAuth,
        userData,
        setIsAdmin,
        setIsAuth,
        setUserData,
        logout,
        loadUserData,
      }}
    >
      {children} 
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within UserProvider");
  }
  return context;
}
