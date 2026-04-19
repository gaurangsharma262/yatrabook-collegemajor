import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './features/auth/AuthContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SearchPage from './pages/SearchPage';
import BookingPage from './pages/BookingPage';
import DashboardPage from './pages/DashboardPage';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-text-muted">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Not Found
function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-mesh text-center px-4">
      <h1 className="text-8xl font-display font-bold text-gradient mb-4">404</h1>
      <p className="text-xl text-text-secondary mb-8">This page has left the station</p>
      <a href="/" className="btn-primary">Back to Home</a>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-dark-900 text-text-primary font-sans">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a2e',
            color: '#f0f0f5',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            backdropFilter: 'blur(20px)',
          },
          success: { iconTheme: { primary: '#00d4aa', secondary: '#1a1a2e' } },
          error: { iconTheme: { primary: '#ff006e', secondary: '#1a1a2e' } },
        }}
      />

      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Search Pages */}
          <Route path="/trains" element={<SearchPage type="train" />} />
          <Route path="/flights" element={<SearchPage type="flight" />} />
          <Route path="/buses" element={<SearchPage type="bus" />} />

          {/* Booking (protected) */}
          <Route path="/book/:type/:id" element={
            <ProtectedRoute><BookingPage /></ProtectedRoute>
          } />

          {/* Dashboard (protected) */}
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/bookings" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
}
