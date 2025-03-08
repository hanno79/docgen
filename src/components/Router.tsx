import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setCurrentPath(to);
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

interface RouteProps {
  path: string;
  element: React.ReactNode;
}

export const Route: React.FC<RouteProps> = ({ path, element }) => {
  const { currentPath } = useRouter();
  
  // Einfache Pfadübereinstimmung mit Unterstützung für dynamische Segmente
  const pathSegments = path.split('/').filter(Boolean);
  const currentSegments = currentPath.split('/').filter(Boolean);
  
  if (pathSegments.length !== currentSegments.length) {
    // Spezialfall für Root-Pfad
    if (path === '/' && currentPath === '/') {
      return <>{element}</>;
    }
    return null;
  }
  
  const match = pathSegments.every((segment, i) => {
    // Dynamisches Segment (beginnt mit :)
    if (segment.startsWith(':')) {
      return true;
    }
    return segment === currentSegments[i];
  });
  
  return match ? <>{element}</> : null;
};

export const Routes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const Link: React.FC<{ to: string; className?: string; children: React.ReactNode }> = ({ 
  to, 
  className = '', 
  children 
}) => {
  const { navigate } = useRouter();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };
  
  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export const Navigate: React.FC<{ to: string }> = ({ to }) => {
  const { navigate } = useRouter();
  
  useEffect(() => {
    navigate(to);
  }, [navigate, to]);
  
  return null;
};
