import { create } from 'zustand';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Session {
  _id: string;
  user: string;
  chat: ChatMessage[];
  code: string;
  css: string;
  createdAt: string;
  updatedAt: string;
}

interface StoreState {
  user: { id: string; email: string } | null;
  token: string | null;
  sessions: Session[];
  currentSession: Session | null;
  chat: ChatMessage[];
  code: string;
  css: string;
  setUser: (user: { id: string; email: string } | null, token: string | null) => void;
  setSessions: (sessions: Session[]) => void;
  setCurrentSession: (session: Session) => void;
  setChat: (chat: ChatMessage[]) => void;
  setCode: (code: string) => void;
  setCss: (css: string) => void;
  reset: () => void;
}

export const useStore = create<StoreState>((set) => ({
  user: null,
  token: null,
  sessions: [],
  currentSession: null,
  chat: [],
  code: '',
  css: '',
  setUser: (user: { id: string; email: string } | null, token: string | null) => set({ user, token }),
  setSessions: (sessions: Session[]) => set({ sessions }),
  setCurrentSession: (session: Session) => set({ currentSession: session, chat: session.chat, code: session.code, css: session.css }),
  setChat: (chat: ChatMessage[]) => set({ chat }),
  setCode: (code: string) => set({ code }),
  setCss: (css: string) => set({ css }),
  reset: () => set({ user: null, token: null, sessions: [], currentSession: null, chat: [], code: '', css: '' }),
})); 