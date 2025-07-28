import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { duotoneSpace } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Copy, Check, Code, Palette } from 'lucide-react';

interface CodeTabsProps {
  code: string;
  css: string;
}

export default function CodeTabs({ code, css }: CodeTabsProps) {
  const [tab, setTab] = useState<'code' | 'css'>('code');
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-2xl"
    >
      <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Code Editor</h3>
            <p className="text-blue-200 text-sm">View and copy your generated code</p>
          </div>
        </div>
      </div>
      
      <div className="flex border-b border-white/20">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 py-4 px-6 font-medium text-sm transition-colors duration-200 ${
            tab === 'code' 
              ? 'text-blue-300 border-b-2 border-blue-400 bg-blue-500/10' 
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
          onClick={() => setTab('code')}
        >
          <div className="flex items-center justify-center space-x-2">
            <Code className="w-4 h-4" />
            <span>JSX/TSX</span>
          </div>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 py-4 px-6 font-medium text-sm transition-colors duration-200 ${
            tab === 'css' 
              ? 'text-blue-300 border-b-2 border-blue-400 bg-blue-500/10' 
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
          onClick={() => setTab('css')}
        >
          <div className="flex items-center justify-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>CSS</span>
          </div>
        </motion.button>
      </div>
      
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 border border-white/20"
          onClick={() => handleCopy(tab === 'code' ? code : css)}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center space-x-2"
              >
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        
        <div className="p-6">
          <AnimatePresence mode="wait">
            {tab === 'code' ? (
              <motion.div 
                key="code"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10"
              >
                <SyntaxHighlighter 
                  language="tsx" 
                  style={duotoneSpace} 
                  wrapLongLines
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    background: 'transparent',
                  }}
                >
                  {code || '// No code generated yet.\n// Start a conversation to generate your first component!'}
                </SyntaxHighlighter>
              </motion.div>
            ) : (
              <motion.div 
                key="css"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10"
              >
                <SyntaxHighlighter 
                  language="css" 
                  style={duotoneSpace} 
                  wrapLongLines
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    background: 'transparent',
                  }}
                >
                  {css || '/* No CSS generated yet.\n   Start a conversation to generate your first component! */'}
                </SyntaxHighlighter>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
} 