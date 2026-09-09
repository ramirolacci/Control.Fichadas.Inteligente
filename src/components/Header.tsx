import { Moon, Sun, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Header = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-base-100/80 border-b border-base-200/60 transition-colors">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-sm shadow-indigo-500/20">
            <div className="w-full h-full bg-base-100 rounded-[6px] flex items-center justify-center">
              <Clock className="w-4 h-4 text-indigo-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base tracking-tight bg-gradient-to-r from-base-content via-base-content/90 to-base-content/70 bg-clip-text">
                Control Fichadas
              </h1>
              <span className="badge badge-xs font-semibold bg-indigo-500/10 text-indigo-500 border-indigo-500/20 px-1.5 py-0.5">
                v2.0
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-xl bg-base-200/80 hover:bg-base-200 border border-base-300/60 flex items-center justify-center text-base-content/80 hover:text-base-content transition-all cursor-pointer"
            title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
};
