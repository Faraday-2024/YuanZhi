import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from '@shared/components/Navigation';
import { ROUTES } from '@/config/constants';

/**
 * Main Layout Component
 * Provides the main application layout with navigation
 */
const MainLayout: React.FC = () => {
  const location = useLocation();
  
  // Dark background for Home and Exploration modes
  const isDarkMode = location.pathname === ROUTES.HOME || 
                     location.pathname === ROUTES.EXPLORATION;
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#020617]' : 'bg-slate-50'}`}>
      <Navigation />
      
      {/* Main content area with top padding for fixed navigation */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
