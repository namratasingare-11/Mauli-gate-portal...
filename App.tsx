import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Syllabus } from './pages/Syllabus';
import { Exam } from './pages/Exam';
import { StudyMaterial } from './pages/StudyMaterial';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { Profile } from './pages/Profile';
import { UserList } from './pages/UserList';
import { storageService } from './services/storageService';

// Guard Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = storageService.getCurrentUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected App Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/syllabus" element={
          <ProtectedRoute>
            <Layout>
              <Syllabus />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/materials" element={
          <ProtectedRoute>
            <Layout>
              <StudyMaterial />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exam" element={
          <ProtectedRoute>
            <Layout>
              <Exam />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute>
            <Layout>
              <UserList />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;