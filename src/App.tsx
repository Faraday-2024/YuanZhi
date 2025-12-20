import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@shared/components';
import { AppProvider } from '@shared/context/AppContext';
import MainLayout from '@layouts/MainLayout';
import Home from '@pages/Home';
import ExamPrepMode from '@pages/ExamPrepMode';
import TopicMode from '@pages/TopicMode';
import ExplorationMode from '@pages/ExplorationMode';
import NotFound from '@pages/NotFound';
import { ROUTES } from '@/config/constants';

/**
 * Main Application Component
 * Configures routing and global providers
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Main Layout Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path={ROUTES.EXAM_PREP} element={<ExamPrepMode />} />
              <Route path={ROUTES.TOPIC} element={<TopicMode />} />
              <Route path={ROUTES.EXPLORATION} element={<ExplorationMode />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
