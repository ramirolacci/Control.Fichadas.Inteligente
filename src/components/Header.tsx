import { Moon, Sun, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeaderProps {
  onLimpiar: () => void;
  tieneDatos: boolean;
}

export const Header = ({ onLimpiar, tieneDatos }: HeaderProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
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
    <header className="navbar bg-primary text-primary-content shadow-lg sticky top-0 z-50">
      <div className="flex-1">
        <span className="text-xl font-bold">🏭 Control Fichadas v2.0</span>
      </div>
      <div className="flex-none gap-2">
        {tieneDatos && (
          <button
            onClick={onLimpiar}
            className="btn btn-ghost btn-sm gap-2"
            title="Limpiar datos"
          >
            <Trash2 size={18} />
            Limpiar
          </button>
        )}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle"
          title="Cambiar tema"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
};
