import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import ServiceSearchPage from '../pages/ServiceSearchPage.jsx';
import ServiceDetailPage from '../pages/ServiceDetailPage.jsx';
import BookingFlowPage from '../pages/BookingFlowPage.jsx';
import BookingsPage from '../pages/BookingsPage.jsx';
import BookingDetailPage from '../pages/BookingDetailPage.jsx';
import WalletPage from '../pages/WalletPage.jsx';
import ReviewsPage from '../pages/ReviewsPage.jsx';
import NotificationsPage from '../pages/NotificationsPage.jsx';
import SupportPage from '../pages/SupportPage.jsx';
import ProviderDashboardPage from '../pages/ProviderDashboardPage.jsx';
import ProviderAvailabilityPage from '../pages/ProviderAvailabilityPage.jsx';
import ProviderAddServicePage from '../pages/ProviderAddServicePage.jsx';
import CategoryAdminPanelPage from '../pages/CategoryAdminPanelPage.jsx';
import ServiceAdminPanelPage from '../pages/ServiceAdminPanelPage.jsx';
import SuperAdminPanelPage from '../pages/SuperAdminPanelPage.jsx';
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../pages/ResetPasswordPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { useAuth } from '../hooks/useAuth.js';

const AppRouter = () => {
  const { bootstrap } = useAuth();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={(
          <ProtectedRoute roles={["customer"]}>
            <DashboardPage />
          </ProtectedRoute>
        )}
      />
      <Route path="/services" element={<ServiceSearchPage />} />
      <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
      <Route
        path="/bookings/new"
        element={(
          <ProtectedRoute roles={["customer"]}>
            <BookingFlowPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/bookings"
        element={(
          <ProtectedRoute roles={["customer"]}>
            <BookingsPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/bookings/:bookingId"
        element={(
          <ProtectedRoute roles={["customer"]}>
            <BookingDetailPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/wallet"
        element={(
          <ProtectedRoute roles={["customer"]}>
            <WalletPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/reviews"
        element={(
          <ProtectedRoute roles={["customer"]}>
            <ReviewsPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/notifications"
        element={(
          <ProtectedRoute roles={['customer','provider','service_admin','category_admin','master_admin','super_admin']}>
            <NotificationsPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/support"
        element={(
          <ProtectedRoute roles={['customer','provider','service_admin','category_admin','master_admin','super_admin']}>
            <SupportPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/provider"
        element={(
          <ProtectedRoute roles={["provider"]}>
            <ProviderDashboardPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/provider/availability"
        element={(
          <ProtectedRoute roles={["provider"]}>
            <ProviderAvailabilityPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/provider/services/new"
        element={(
          <ProtectedRoute roles={["provider"]}>
            <ProviderAddServicePage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/admin/category"
        element={(
          <ProtectedRoute roles={["category_admin"]}>
            <CategoryAdminPanelPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/admin/service"
        element={(
          <ProtectedRoute roles={["service_admin"]}>
            <ServiceAdminPanelPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/admin/super"
        element={(
          <ProtectedRoute roles={["super_admin"]}>
            <SuperAdminPanelPage />
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
