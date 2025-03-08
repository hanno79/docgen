import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from '../components/Router';
import { useTheme } from '../hooks/useTheme';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const { navigate } = useRouter();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name) {
          setError('Bitte geben Sie Ihren Namen ein');
          return;
        }
        await register(name, email, password);
      }
      navigate('/');
    } catch (err) {
      setError('Authentifizierung fehlgeschlagen');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className={`w-full max-w-md p-8 space-y-8 rounded-lg shadow-md ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold">GIS Script Dokumentation</h1>
          <h2 className="mt-2 text-xl">{isLogin ? 'Anmelden' : 'Registrieren'}</h2>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              E-Mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLogin ? 'Anmelden' : 'Registrieren'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            {isLogin ? 'Neues Konto erstellen' : 'Bereits registriert? Anmelden'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
