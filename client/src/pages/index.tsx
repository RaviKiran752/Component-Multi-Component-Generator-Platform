import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code, Download, LogOut, User, MessageSquare, Eye, Copy } from 'lucide-react';
import ChatPanel from '../components/ChatPanel';
import CodeTabs from '../components/CodeTabs';
import LivePreview from '../components/LivePreview';
import SessionList from '../components/SessionList';
import { useStore } from '../store/useStore';
import { getSessions, createSession, getSessionById, aiGenerate, exportSession } from '../services/api';
import '../app/globals.css';

export default function HomePage() {
  const { user, token, sessions, currentSession, chat, code, css, setUser, setSessions, setCurrentSession, setChat, setCode, setCss } = useStore();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Load user/token from localStorage on mount
  useEffect(() => {
    if (!token) {
      const t = localStorage.getItem('token');
      if (t) setUser(user, t);
      else router.push('/login');
    }
  }, [token, setUser, user, router]);

  // Fetch sessions on login
  useEffect(() => {
    if (token) {
      getSessions(token).then(res => setSessions(res.data)).catch(() => {});
    }
  }, [token, setSessions]);

  // Auto-save session on chat/code/css change
  useEffect(() => {
    if (token && chat.length > 0) {
      const data = { chat, code, css };
      if (currentSession) {
        // Optionally implement updateSession here
      } else {
        createSession(data, token).then(res => setCurrentSession(res.data)).catch(() => {});
      }
    }
    // eslint-disable-next-line
  }, [chat, code, css]);

  const handleSend = async (prompt: string) => {
    setAiLoading(true);
    setError('');
    try {
      setChat([...chat, { role: 'user', content: prompt }]);
      const res = await aiGenerate(prompt, token!);
      setChat([...chat, { role: 'user', content: prompt }, { role: 'assistant', content: res.data.code }]);
      setCode(res.data.code);
      setCss(res.data.css);
    } catch (err: unknown) {
      setError('AI generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSelectSession = async (id: string) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getSessionById(id, token);
      setCurrentSession(res.data);
    } catch {
      setError('Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!token || !currentSession) return;
    try {
      const res = await exportSession(currentSession._id, token);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `session-${currentSession._id}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('Export failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null, null);
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-4"
      >
        <div className="flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Component Generator
            </h1>
          </motion.div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
              <User className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">
                {user?.email}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-80 bg-white/10 backdrop-blur-xl border-r border-white/20 flex flex-col"
        >
          <div className="flex-1 p-6 overflow-hidden">
            <SessionList sessions={sessions} onSelect={handleSelectSession} currentId={currentSession?._id || null} />
          </div>

          <div className="p-6 pt-0">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                disabled={!currentSession}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Zip</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
            <motion.div
              className="grid grid-cols-1 xl:grid-cols-2 gap-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <LivePreview code={code} css={css} />
              <CodeTabs code={code} css={css} />
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ChatPanel chat={chat} onSend={handleSend} loading={aiLoading} />
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-200 px-4 py-3 rounded-xl"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 