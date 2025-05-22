import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: number;
  username: string;
  role: string;
  email: string;
  banned: boolean;
}

interface UserCtx {
  user: User | null;
  setUser: (u: User | null) => void;
}

const UserContext = createContext<UserCtx | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? (JSON.parse(saved) as User) : null;
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be inside <UserProvider>");
  return ctx;
}
