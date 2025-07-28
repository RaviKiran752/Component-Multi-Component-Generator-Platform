import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Clock, CheckCircle } from 'lucide-react';

interface Session {
  _id: string;
  createdAt: string;
}

interface SessionListProps {
  sessions: Session[];
  onSelect: (id: string) => void;
  currentId: string | null;
}

export default function SessionList({ sessions, onSelect, currentId }: SessionListProps) {
  return (
    <div className="flex flex-col h-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <h3 className="text-lg font-semibold text-white">Sessions</h3>
        <div className="bg-blue-500/20 backdrop-blur-sm text-blue-200 text-xs font-medium px-3 py-1 rounded-full border border-blue-500/30">
          {sessions.length}
        </div>
      </motion.div>
      
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {sessions.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-300" />
              </div>
              <p className="text-gray-300 text-sm">No sessions yet</p>
              <p className="text-gray-400 text-xs mt-1">Your conversations will appear here</p>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {sessions.map((session, index) => (
                <motion.button
                  key={session._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(session._id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                    currentId === session._id 
                      ? 'bg-blue-500/20 border-blue-400/50 shadow-lg shadow-blue-500/20' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <FileText className="w-4 h-4 text-blue-300 flex-shrink-0" />
                        <p className={`text-sm font-medium truncate ${
                          currentId === session._id ? 'text-blue-200' : 'text-white'
                        }`}>
                          Session {session._id.slice(-6)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <p className={`text-xs truncate ${
                          currentId === session._id ? 'text-blue-300' : 'text-gray-400'
                        }`}>
                          {new Date(session.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <AnimatePresence>
                      {currentId === session._id && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="text-blue-400 flex-shrink-0 ml-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 