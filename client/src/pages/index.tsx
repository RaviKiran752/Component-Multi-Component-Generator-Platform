import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, LogOut, User, Menu, X } from 'lucide-react';
import ChatPanel from '../components/ChatPanel';
import CodeTabs from '../components/CodeTabs';
import LivePreview from '../components/LivePreview';
import SessionList from '../components/SessionList';
import { useStore } from '../store/useStore';
import { getSessions, createSession, getSessionById, aiGenerate, exportSession } from '../services/api';
import '../app/globals.css'; // Crucial import for CSS to load

export default function HomePage() {
  const { user, token, sessions, currentSession, chat, code, css, setUser, setSessions, setCurrentSession, setChat, setCode, setCss } = useStore();
  const [aiLoading, setAiLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    setSessionLoading(true);
    try {
      const res = await getSessionById(id, token);
      setCurrentSession(res.data);
      setSidebarOpen(false); // Close sidebar on mobile after selection
    } catch {
      setError('Failed to load session');
    } finally {
      setSessionLoading(false);
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
        <div className="absolute top-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20 px-4 sm:px-6 py-3 sm:py-4"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden bg-white/10 backdrop-blur-sm p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
            
            <motion.div
              className="flex items-center space-x-2 sm:space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Component Generator
              </h1>
            </motion.div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              <span className="text-white text-xs sm:text-sm font-medium">
                {user?.email}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-colors flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)]">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: sidebarOpen ? 0 : -300, opacity: sidebarOpen ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed md:relative z-30 w-72 md:w-80 bg-white/10 backdrop-blur-xl border-r border-white/20 flex flex-col h-full transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="flex-1 p-4 sm:p-6 overflow-hidden">
            <SessionList sessions={sessions} onSelect={handleSelectSession} currentId={currentSession?._id || null} />
          </div>

          <div className="p-4 sm:p-6 pt-0">
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
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Download Zip</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col p-3 sm:p-6 space-y-3 sm:space-y-6 overflow-y-auto">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6"
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
                  className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-200 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm"
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