import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const FOUNDER_EMAILS = [
  "muhammadrazeen969@gmail.com",
  "inforezocreative123@gmail.com",
];

export interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  isFounder: boolean;
  createdAt: string;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const userJson = await AsyncStorage.getItem("aera_user");
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const usersJson = (await AsyncStorage.getItem("aera_users")) ?? "[]";
    const users = JSON.parse(usersJson) as StoredUser[];
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );
    if (!found) throw new Error("Invalid email or password");
    const { password: _pw, ...userData } = found;
    await AsyncStorage.setItem("aera_user", JSON.stringify(userData));
    setUser(userData);
  }

  async function register(name: string, email: string, password: string) {
    const usersJson = (await AsyncStorage.getItem("aera_users")) ?? "[]";
    const users = JSON.parse(usersJson) as StoredUser[];
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists");
    }
    const isFounder = FOUNDER_EMAILS.includes(email.toLowerCase());
    const newUser: StoredUser = {
      id:
        Date.now().toString() + Math.random().toString(36).substring(2, 9),
      email,
      name,
      isPremium: isFounder,
      isFounder,
      createdAt: new Date().toISOString(),
      password,
    };
    users.push(newUser);
    await AsyncStorage.setItem("aera_users", JSON.stringify(users));
    const { password: _pw, ...userData } = newUser;
    await AsyncStorage.setItem("aera_user", JSON.stringify(userData));
    setUser(userData);
  }

  async function logout() {
    await AsyncStorage.removeItem("aera_user");
    setUser(null);
  }

  async function updateUser(updates: Partial<User>) {
    if (!user) return;
    const updated = { ...user, ...updates };
    await AsyncStorage.setItem("aera_user", JSON.stringify(updated));
    setUser(updated);
  }

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, updateUser }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
