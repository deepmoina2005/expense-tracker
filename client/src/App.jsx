import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, lazy, Suspense } from 'react';
import { getMe } from './features/auth/authSlice';
import { fetchPreferences } from './features/preferences/preferencesSlice';

// Layouts
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));

// Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const BudgetsPage = lazy(() => import('./pages/BudgetsPage'));
const SavingsPage = lazy(() => import('./pages/SavingsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ActivityPage = lazy(() => import('./pages/ActivityPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));

import LoadingPage from './components/LoadingPage';

function App() {
  const { user, token } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.preferences);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      if (!user) dispatch(getMe());
      dispatch(fetchPreferences());
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const ProtectedRoute = ({ children }) => {
    if (!token) return <Navigate to="/login" />;
    return children;
  };

  return (
    <Router>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          {/* Public: Landing Page */}
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <LandingPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/dashboard" />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="budgets" element={<BudgetsPage />} />
            <Route path="savings" element={<SavingsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
