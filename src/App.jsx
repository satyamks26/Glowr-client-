import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import LeaderboardPage from './pages/LeaderboardPage';
import RoadmapPage from './pages/RoadmapPage';
import WardrobePage from './pages/WardrobePage';
import BattlesPage from './pages/BattlesPage';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <AuthPage />}
        />
        <Route
          path="/"
          element={<ProtectedRoute><HomePage /></ProtectedRoute>}
        />
        <Route
          path="/history"
          element={<ProtectedRoute><HistoryPage /></ProtectedRoute>}
        />
        <Route
          path="/leaderboard"
          element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>}
        />
        <Route
          path="/roadmap"
          element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>}
        />
        <Route
          path="/wardrobe"
          element={<ProtectedRoute><WardrobePage /></ProtectedRoute>}
        />
        <Route
          path="/battles"
          element={<ProtectedRoute><BattlesPage /></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
