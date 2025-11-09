import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import TopicArticles from './pages/TopicArticles';
import Lesson from './pages/Lesson';
import Task from './pages/Task';
import './App.css';

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const showNavbar = isAuthenticated && !['/login', '/register', '/dashboard'].includes(location.pathname) && !location.pathname.startsWith('/topic/');
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <main className={`main-content ${isDashboard ? 'dashboard-page' : ''}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={<Dashboard />} 
              />
              <Route 
                path="/topic/:topic" 
                element={
                  <ProtectedRoute>
                    <TopicArticles />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/topic/:topic/lesson/:lessonNumber" 
                element={
                  <ProtectedRoute>
                    <Lesson />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/topic/:topic/lesson/:lessonNumber/task/:taskNumber" 
                element={
                  <ProtectedRoute>
                    <Task />
                  </ProtectedRoute>
                } 
              />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;