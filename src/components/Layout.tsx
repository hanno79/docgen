import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useRouter, Link } from './Router';
import { Sun, Moon, LogOut, User } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const { navigate } = useRouter();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {isAuthenticated && (
        <header className={`py-4 px-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">
              GIS Script Dokumentation
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label={theme === 'dark' ? 'Zum hellen Modus wechseln' : 'Zum dunklen Modus wechseln'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <LogOut size={20} className="mr-2" />
                <span>Abmelden</span>
              </button>
            </div>
          </div>
        </header>
      )}
      <main className="container mx-auto py-4 px-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
