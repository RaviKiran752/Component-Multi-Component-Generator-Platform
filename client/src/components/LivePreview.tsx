import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, Play } from 'lucide-react';

interface LivePreviewProps {
  code: string;
  css: string;
}

export default function LivePreview({ code, css }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const jsxToHtml = (jsxCode: string) => {
    if (!jsxCode) return '';
    
    let html = jsxCode;
    
    // Remove all import statements (including multi-line imports)
    html = html.replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '');
    html = html.replace(/import\s+.*?;?\s*/g, '');
    
    // Remove CSS import comments
    html = html.replace(/\/\/.*?\.css.*?$/gm, '');
    
    // Remove function declarations and get only the JSX content
    // Handle different function patterns
    html = html.replace(/export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?return\s*\(/g, '');
    html = html.replace(/function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?return\s*\(/g, '');
    html = html.replace(/const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?return\s*\(/g, '');
    html = html.replace(/const\s+\w+\s*=\s*\(\)\s*=>\s*\{[\s\S]*?return\s*\(/g, '');
    html = html.replace(/return\s*\(/g, '');
    
    // Remove the closing parts
    html = html.replace(/\);?\s*$/g, '');
    html = html.replace(/^\s*\{/, '');
    html = html.replace(/\s*\}\s*$/g, '');
    
    // Clean up any remaining function content
    html = html.replace(/export\s+default\s+\w+;?\s*$/g, '');
    html = html.replace(/};?\s*$/g, '');
    
    // Remove any remaining React-specific code
    html = html.replace(/React\./g, '');
    html = html.replace(/useState\([^)]*\)/g, '');
    html = html.replace(/useEffect\([^)]*\)/g, '');
    html = html.replace(/useRef\([^)]*\)/g, '');
    
    // Convert JSX to HTML
    html = html
      .replace(/className=/g, 'class=')
      .replace(/onClick=/g, 'onclick=')
      .replace(/onChange=/g, 'onchange=')
      .replace(/onSubmit=/g, 'onsubmit=')
      .replace(/onInput=/g, 'oninput=')
      .replace(/onBlur=/g, 'onblur=')
      .replace(/onFocus=/g, 'onfocus=')
      .replace(/onMouseEnter=/g, 'onmouseenter=')
      .replace(/onMouseLeave=/g, 'onmouseleave=')
      .replace(/onKeyDown=/g, 'onkeydown=')
      .replace(/onKeyUp=/g, 'onkeyup=')
      .replace(/onKeyPress=/g, 'onkeypress=')
      .replace(/onLoad=/g, 'onload=')
      .replace(/onError=/g, 'onerror=')
      .replace(/style=\{\{([^}]+)\}\}/g, (match, styles) => {
        // Convert React style object to CSS string
        const cssString = styles
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .replace(/['"]/g, '')
          .replace(/,/g, ';')
          .replace(/;/g, '; ');
        return `style="${cssString}"`;
      })
      .replace(/\{([^}]+)\}/g, '$1') // Remove remaining JSX expressions
      .replace(/\/>/g, '>') // Convert self-closing tags
      .replace(/<(\w+)\s+class=/g, '<$1 class=') // Fix class attribute spacing
      .replace(/<(\w+)\s+style=/g, '<$1 style=') // Fix style attribute spacing
      .replace(/\s+/g, ' ') // Clean up extra whitespace
      .trim();
    
    return html;
  };

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    
    const htmlContent = jsxToHtml(code);
    
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            ${css}
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial, sans-serif; 
              background: #f5f5f5;
            }
            .component-container { 
              min-height: 200px; 
              background: white;
              border-radius: 8px;
              padding: 20px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .preview-placeholder {
              color: #666; 
              text-align: center; 
              margin-top: 80px;
              font-size: 14px;
            }
            /* Default styles for common elements */
            nav { background: #333; padding: 1rem; }
            nav a { color: white; text-decoration: none; margin-right: 1rem; }
            button { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; }
            .btn-primary { background: #007bff; color: white; }
            .btn-secondary { background: #6c757d; color: white; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
            .navbar { display: flex; justify-content: space-between; align-items: center; }
            .navbar-brand { font-size: 1.5rem; font-weight: bold; }
            .navbar-nav { display: flex; list-style: none; margin: 0; padding: 0; }
            .navbar-nav li { margin-left: 1rem; }
            .hero { text-align: center; padding: 4rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
            .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
            .hero p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
            .hero button { font-size: 1.1rem; padding: 1rem 2rem; }
            .card { background: white; border-radius: 8px; padding: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 1rem; }
            .form-group { margin-bottom: 1rem; }
            .form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
            .form-group input, .form-group textarea { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="component-container">
            ${htmlContent ? `
              <div id="preview">
                ${htmlContent}
              </div>
            ` : '<p class="preview-placeholder">Generate a component to see the preview</p>'}
          </div>
        </body>
      </html>
    `);
    doc.close();
  }, [code, css]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-2xl"
    >
      <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Live Preview</h3>
            <p className="text-blue-200 text-sm">See your component in action</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden relative">
          {(!code && !css) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-blue-300" />
                </div>
                <p className="text-gray-300 text-sm">Generate a component to see the preview</p>
              </div>
            </motion.div>
          )}
          <iframe
            ref={iframeRef}
            title="Live Preview"
            className="w-full h-80 border-none bg-white"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </motion.div>
  );
} 