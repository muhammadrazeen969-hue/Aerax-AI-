import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  mode: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ChatContextValue {
  conversations: Conversation[];
  createConversation: (mode: string, title?: string) => Conversation;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  getConversation: (id: string) => Conversation | undefined;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("aera_conversations").then((json) => {
      if (json) setConversations(JSON.parse(json));
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(
        "aera_conversations",
        JSON.stringify(conversations)
      );
    }
  }, [conversations, loaded]);

  function createConversation(mode: string, title = "New Chat"): Conversation {
    const conv: Conversation = {
      id:
        Date.now().toString() + Math.random().toString(36).substring(2, 9),
      title,
      mode,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConversations((prev) => [conv, ...prev]);
    return conv;
  }

  function updateConversation(id: string, updates: Partial<Conversation>) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, ...updates, updatedAt: new Date().toISOString() }
          : c
      )
    );
  }

  function deleteConversation(id: string) {
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }

  function getConversation(id: string) {
    return conversations.find((c) => c.id === id);
  }

  const value = useMemo(
    () => ({
      conversations,
      createConversation,
      updateConversation,
      deleteConversation,
      getConversation,
    }),
    [conversations]
  );

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
