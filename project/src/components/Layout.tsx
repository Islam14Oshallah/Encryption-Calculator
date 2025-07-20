import React, { useState, useEffect } from 'react';
import { Shield, Moon, Sun } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved user preference
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or default to light
    if (savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Toggle dark class on html element
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save user preference
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-slate-900 animate-fadeIn">
      <header className="bg-gradient-to-r from-blue-500 to-teal-400 dark:from-blue-600 dark:to-teal-500 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="w-8 h-8 mr-2 transform transition-transform hover:rotate-12" />
            <h1 className="text-2xl font-bold">Multi-Layer Encryption</h1>
          </div>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
            aria-label="Toggle dark mode"
          >
            {darkMode ? 
              <Sun className="w-5 h-5" /> : 
              <Moon className="w-5 h-5" />
            }
          </button>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 md:p-6">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-4 mt-8">
      <div className="container mx-auto px-4 text-center">
        <p>© 2025 Multi-Layer Encryption App. All rights reserved.</p>
        <div className="flex justify-center mt-2 space-x-4">
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center transition-transform hover:translate-y-[-2px]">
            <Shield className="w-4 h-4 mr-1" />
            Privacy Policy
          </a>
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center transition-transform hover:translate-y-[-2px]">
            <Shield className="w-4 h-4 mr-1" />
            Terms of Service
          </a>
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center transition-transform hover:translate-y-[-2px]">
            <Shield className="w-4 h-4 mr-1" />
            About
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Layout;