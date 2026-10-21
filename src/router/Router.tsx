import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type RoutePath =
  | '/'
  | '/dashboard'
  | '/account'
  | '/settings'
  | '/signin'
  | '/signup'
  | '/forgot-password'
  | string;

interface RouterContextType {
  path: RoutePath;
  navigate: (to: RoutePath) => void;
  replace: (to: RoutePath) => void;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
  replace: () => {},
});

export const useRouter = (): RouterContextType => {
  return useContext(RouterContext);
};

interface RouterProviderProps {
  children: ReactNode;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const getInitialPath = (): RoutePath => {
    if (typeof window === 'undefined') return '/';
    const current = window.location.pathname;
    return current || '/';
  };

  const [path, setPath] = useState<RoutePath>(getInitialPath);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (to: RoutePath) => {
    if (typeof window !== 'undefined' && window.location.pathname !== to) {
      window.history.pushState({}, '', to);
      setPath(to);
      window.scrollTo(0, 0);
    }
  };

  const replace = (to: RoutePath) => {
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', to);
      setPath(to);
      window.scrollTo(0, 0);
    }
  };

  return (
    <RouterContext.Provider value={{ path, navigate, replace }}>
      {children}
    </RouterContext.Provider>
  );
};

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: RoutePath;
  children: ReactNode;
  className?: string;
}

export const Link: React.FC<LinkProps> = ({ to, children, className, onClick, ...rest }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    // Allow default behaviour for Ctrl/Cmd+click or right-click (open in new tab)
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
};
