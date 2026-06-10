import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import PublicLayout from './components/PublicLayout'

// ── Lazy page imports — code-split mỗi page ───────────────────────────────────
const LandingPage    = lazy(() => import('./pages/LandingPage'))
const LoginPage      = lazy(() => import('./pages/LoginPage'))
const ProfilePage    = lazy(() => import('./pages/ProfilePage'))
const HeroDetailPage = lazy(() => import('./pages/HeroDetailPage'))
const DonationPage   = lazy(() => import('./pages/DonationPage'))
const NotFoundPage   = lazy(() => import('./pages/NotFoundPage'))
const ForbiddenPage  = lazy(() => import('./pages/ForbiddenPage'))

const PublicHeroListPage    = lazy(() => import('./pages/PublicHeroListPage'))
const PublicArticleListPage = lazy(() => import('./pages/PublicArticleListPage'))
const ArticleDetailPage     = lazy(() => import('./pages/ArticleDetailPage'))

const DashboardPage      = lazy(() => import('./pages/admin/DashboardPage'))
const HeroListPage       = lazy(() => import('./pages/admin/HeroListPage'))
const ArticleListPage    = lazy(() => import('./pages/admin/ArticleListPage'))
const DonationsAdminPage = lazy(() => import('./pages/admin/DonationsAdminPage'))
const VideoListPage      = lazy(() => import('./pages/admin/VideoListPage'))
const UserListPage       = lazy(() => import('./pages/admin/UserListPage'))

function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDF5EE' }}>
      <div
        style={{ width: 40, height: 40, border: '3px solid rgba(196,149,106,0.25)', borderTopColor: '#8B1A1A', borderRadius: '50%' }}
        className="animate-spin"
      />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* ── Public routes ────────────────────────────────────────── */}
                <Route path="/"               element={<PublicLayout><LandingPage /></PublicLayout>} />
                <Route path="/dang-nhap"      element={<LoginPage />} />
                <Route path="/dang-ky"        element={<LoginPage />} />
                <Route path="/anh-hung"        element={<PublicLayout><PublicHeroListPage /></PublicLayout>} />
                <Route path="/anh-hung/:slug" element={<PublicLayout><HeroDetailPage /></PublicLayout>} />
                <Route path="/bai-viet"       element={<PublicLayout><PublicArticleListPage /></PublicLayout>} />
                <Route path="/bai-viet/:slug" element={<PublicLayout><ArticleDetailPage /></PublicLayout>} />
                <Route path="/quyen-gop"      element={<PublicLayout><DonationPage /></PublicLayout>} />

                {/* ── Auth-protected public pages ──────────────────────────── */}
                <Route path="/ho-so" element={
                  <ProtectedRoute>
                    <PublicLayout><ProfilePage /></PublicLayout>
                  </ProtectedRoute>
                } />

                {/* ── Admin routes (auth-protected) ────────────────────────── */}
                <Route path="/admin" element={
                  <ProtectedRoute><DashboardPage /></ProtectedRoute>
                } />
                <Route path="/admin/anh-hung" element={
                  <ProtectedRoute><HeroListPage /></ProtectedRoute>
                } />
                <Route path="/admin/bai-viet" element={
                  <ProtectedRoute><ArticleListPage /></ProtectedRoute>
                } />
                <Route path="/admin/quyen-gop" element={
                  <ProtectedRoute><DonationsAdminPage /></ProtectedRoute>
                } />
                <Route path="/admin/video" element={
                  <ProtectedRoute><VideoListPage /></ProtectedRoute>
                } />
                <Route path="/admin/nguoi-dung" element={
                  <ProtectedRoute><UserListPage /></ProtectedRoute>
                } />

                {/* ── Error pages ──────────────────────────────────────────── */}
                <Route path="/403" element={<PublicLayout><ForbiddenPage /></PublicLayout>} />
                <Route path="*"    element={<PublicLayout><NotFoundPage /></PublicLayout>} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
