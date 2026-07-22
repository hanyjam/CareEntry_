import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AnamnesePage from './pages/AnamnesePage';
import PatientenPage from './pages/PatientenPage';
import PatientDetailPage from './pages/PatientDetailPage';
import LabValuesPage from './pages/LabValuesPage';
import MessagesPage from './pages/MessagesPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/anamnese"
              element={
                <ProtectedRoute>
                  <AnamnesePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patienten"
              element={
                <ProtectedRoute>
                  <PatientenPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patienten/:id"
              element={
                <ProtectedRoute>
                  <PatientDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/laborwerte"
              element={
                <ProtectedRoute>
                  <LabValuesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nachrichten"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;