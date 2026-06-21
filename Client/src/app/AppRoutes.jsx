import { Routes, Route } from 'react-router-dom';

import PublicLayout from '@/components/layout/PublicLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

import HomePage from '@/features/jobs/HomePage';
import JobsListPage from '@/features/jobs/JobsListPage';
import JobDetailsPage from '@/features/jobs/JobDetailsPage';

import LoginPage from '@/features/auth/LoginPage';
import RegisterPage from '@/features/auth/RegisterPage';
import ForgotPasswordPage from '@/features/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/features/auth/ResetPasswordPage';

import ProfilePage from '@/features/users/ProfilePage';
import DashboardOverview from '@/features/jobs/DashboardOverview';

import MyApplicationsPage from '@/features/applications/MyApplicationsPage';
import RecruiterApplicationsPage from '@/features/applications/RecruiterApplicationsPage';

import CompaniesPage from '@/features/companies/CompaniesPage';
import NewCompanyPage from '@/features/companies/NewCompanyPage';
import CompanyDetailsPage from '@/features/companies/CompanyDetailsPage';
import RecruiterJobsPage from '@/features/jobs/RecruiterJobsPage';
import NewJobPage from '@/features/jobs/NewJobPage';

import CareerGuidancePage from '@/features/ai/CareerGuidancePage';
import ResumeAnalyzerPage from '@/features/ai/ResumeAnalyzerPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public layout (navbar + footer) — unauthenticated browsing */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsListPage />} />
        <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
      </Route>

      {/* Auth pages — no navbar/footer */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset/:token" element={<ResetPasswordPage />} />

      {/* Dashboard layout (navbar + sidebar) — everything that needs the sidebar */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Job seeker only */}
        <Route
          path="/applications"
          element={
            <ProtectedRoute allowedRoles={['job_seeker']}>
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai/career-guidance"
          element={
            <ProtectedRoute allowedRoles={['job_seeker']}>
              <CareerGuidancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai/resume-analyzer"
          element={
            <ProtectedRoute allowedRoles={['job_seeker']}>
              <ResumeAnalyzerPage />
            </ProtectedRoute>
          }
        />

        {/* Recruiter only */}
        <Route
          path="/dashboard/companies"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <CompaniesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/companies/new"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <NewCompanyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/companies/:companyId"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <CompanyDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/jobs"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterJobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/jobs/new"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <NewJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/applications"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterApplicationsPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
