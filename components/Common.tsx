import React, { useState, useEffect, useContext, createContext } from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';

// --- Router Shim (Replaces react-router-dom) ---
const RouterContext = createContext<{ path: string; navigate: (p: string) => void }>({ path: '/', navigate: () => {} });

export const HashRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(window.location.hash.slice(1) || '/');
  useEffect(() => {
    const handler = () => setPath(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  const navigate = (newPath: string) => { window.location.hash = newPath; };
  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
};

export const Routes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { path } = useContext(RouterContext);
  const routes = React.Children.toArray(children);
  for (const child of routes) {
    if (React.isValidElement(child)) {
      const childPath = (child.props as any).path;
      if (childPath === path || childPath === '*') return child;
    }
  }
  return null;
};

export const Route: React.FC<{ path: string; element: React.ReactNode }> = ({ element }) => <>{element}</>;

export const useNavigate = () => {
  const { navigate } = useContext(RouterContext);
  return (to: string | number) => {
    if (typeof to === 'number') window.history.go(to);
    else navigate(to);
  };
};

export const useLocation = () => {
  const { path } = useContext(RouterContext);
  return { pathname: path, search: '', hash: window.location.hash, state: null, key: 'default' };
};

export const Navigate: React.FC<{ to: string; replace?: boolean; state?: any }> = ({ to }) => {
  const { navigate } = useContext(RouterContext);
  useEffect(() => { navigate(to); }, [to, navigate]);
  return null;
};

export const Link: React.FC<{ to: string; children: React.ReactNode; className?: string }> = ({ to, children, className }) => {
  const { navigate } = useContext(RouterContext);
  return <a href={`#${to}`} onClick={(e) => { e.preventDefault(); navigate(to); }} className={className}>{children}</a>;
};

export const NavLink: React.FC<{ to: string; children: React.ReactNode | ((props: { isActive: boolean }) => React.ReactNode); className?: string | ((props: { isActive: boolean }) => string); onClick?: () => void }> = ({ to, children, className, onClick }) => {
  const { path, navigate } = useContext(RouterContext);
  const isActive = path === to;
  const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;
  const resolvedChildren = typeof children === 'function' ? children({ isActive }) : children;
  return (
    <a href={`#${to}`} onClick={(e) => { e.preventDefault(); navigate(to); if (onClick) onClick(); }} className={resolvedClassName}>
      {resolvedChildren}
    </a>
  );
};

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void; id?: string }> = ({ children, className = '', onClick, id }) => (
  <div 
    id={id}
    onClick={onClick}
    className={`bg-white rounded-xl shadow-soft border border-stone-100 ${onClick ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : ''} ${className}`}
  >
    {children}
  </div>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', icon: Icon, className = '', ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-800 to-primary-700 text-white hover:to-primary-900 shadow-md hover:shadow-lg focus:ring-primary-500",
    secondary: "bg-stone-100 text-stone-700 hover:bg-stone-200 focus:ring-stone-400 border border-stone-200",
    outline: "border-2 border-primary-700 text-primary-800 bg-transparent hover:bg-primary-50 focus:ring-primary-500",
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-md focus:ring-red-500",
    ghost: "text-primary-700 hover:bg-primary-50 hover:text-primary-900 focus:ring-primary-500",
    glass: "bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border border-white/30 shadow-lg",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base tracking-wide",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {Icon && <Icon className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} mr-2`} />}
      {children}
    </button>
  );
};

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; color?: 'brown' | 'blue' | 'green' | 'red' | 'yellow' | 'slate' | 'purple' | 'indigo' | 'orange'; className?: string }> = ({ children, color = 'brown', className = '' }) => {
  const colors = {
    brown: "bg-primary-50 text-primary-800 border-primary-200 ring-primary-500/20",
    blue: "bg-blue-50 text-blue-800 border-blue-200 ring-blue-500/20",
    green: "bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-500/20",
    red: "bg-rose-50 text-rose-800 border-rose-200 ring-rose-500/20",
    yellow: "bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/20",
    slate: "bg-stone-100 text-stone-700 border-stone-200 ring-stone-500/20",
    purple: "bg-violet-50 text-violet-800 border-violet-200 ring-violet-500/20",
    indigo: "bg-indigo-50 text-indigo-800 border-indigo-200 ring-indigo-500/20",
    orange: "bg-orange-50 text-orange-800 border-orange-200 ring-orange-500/20",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ring-1 ring-inset ${colors[color]} shadow-sm ${className}`}>
      {children}
    </span>
  );
};

// --- ProgressBar ---
export const ProgressBar: React.FC<{ value: number; max?: number; color?: string }> = ({ value, max = 100, color = "bg-gradient-to-r from-primary-600 to-primary-500" }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden border border-stone-100 shadow-inner">
      <div 
        className={`${color} h-full rounded-full transition-all duration-700 ease-out shadow-sm`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

// --- Breadcrumb ---
export const Breadcrumb: React.FC<{ items: { label: string; path?: string }[] }> = ({ items }) => (
  <nav className="flex text-sm text-stone-500 font-medium mb-6 animate-fade-in" aria-label="Breadcrumb">
    <ol className="inline-flex items-center space-x-1 md:space-x-3">
      {items.map((item, index) => (
        <li key={index} className="inline-flex items-center">
          {index > 0 && <ChevronRight className="w-4 h-4 text-stone-400 mx-1" />}
          {item.path ? (
            <Link to={item.path} className="inline-flex items-center hover:text-primary-700 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-stone-800 font-bold">{item.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);