import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Brain, Sparkles, Home } from 'lucide-react';
import { APP_NAME, MODE_METADATA, ROUTES } from '@/config/constants';
import { ModeType } from '../types/common';
import { useAppContext } from '../context/AppContext';
import { pathToMode } from '../utils/routeHelpers';

interface NavigationProps {
  currentMode?: ModeType;
}

/**
 * Navigation Component
 * Top navigation bar with mode switching
 */
const Navigation: React.FC<NavigationProps> = () => {
  const location = useLocation();
  const { setCurrentMode } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Update current mode when location changes
  useEffect(() => {
    const mode = pathToMode(location.pathname);
    if (mode) {
      setCurrentMode(mode);
    }
  }, [location.pathname, setCurrentMode]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: ROUTES.HOME,
      label: '首页',
      icon: Home,
    },
    {
      path: ROUTES.EXAM_PREP,
      label: MODE_METADATA.EXAM_PREP.title,
      icon: BookOpen,
    },
    {
      path: ROUTES.TOPIC,
      label: MODE_METADATA.TOPIC.title,
      icon: Brain,
    },
    {
      path: ROUTES.EXPLORATION,
      label: MODE_METADATA.EXPLORATION.title,
      icon: Sparkles,
    },
  ];

  // Only HOME and EXPLORATION have dark backgrounds
  const isDarkBackground = () => {
    return location.pathname === ROUTES.HOME || 
           location.pathname === ROUTES.EXPLORATION;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-transparent backdrop-blur-sm z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link 
            to={ROUTES.HOME}
            className="flex items-center gap-3 group"
          >
            <div className="hidden sm:block">
              <h1 className={`text-xl font-bold ${isDarkBackground() ? 'text-white' : 'text-slate-900'} tracking-tight transition-colors`}>
                {APP_NAME}
              </h1>
              <p className={`text-xs ${isDarkBackground() ? 'text-white/70' : 'text-slate-900/70'} transition-colors`}>助你学习的超级后盾</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                    ${active 
                      ? `${isDarkBackground() ? 'bg-white/20 text-white' : 'bg-slate-900/20 text-slate-900'}` 
                      : `${isDarkBackground() ? 'text-white/70 hover:text-white' : 'text-slate-900/70 hover:text-slate-900'} ${isDarkBackground() ? 'hover:bg-white/10' : 'hover:bg-slate-900/10'}`
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 ${isDarkBackground() ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-900/10'} rounded-lg transition-colors`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-white/10 shadow-lg animate-slideIn">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
                    ${active 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
