import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/layout/Layout';
import { ErrorBoundary, LoadingSpinner, MyPageForm, MyProfileForm, EditProfileForm, SignupForm } from '@/components';
import KakaoLogin from '@/components/auth/KakaoLogin';
import { PublicRoute } from '@/routes/PublicRoute';
import { PrivateRoute } from '@/routes/PrivateRoute';

const MainPage = lazy(() => import('@/pages/main/MainPage'));
const BlogDetailPage = lazy(() => import('@/pages/blog/BlogDetailPage'));
const BlogWritePage = lazy(() => import('@/pages/blog/BlogWritePage'));
const MyPage = lazy(() => import('@/pages/mypage/MyPage'));
const AnalysisPage = lazy(() => import('@/pages/analysis/AnalysisPage').then(m => ({ default: m.AnalysisPage })));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <MainPage />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      {
        path: 'blog/:id',
        element: (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <BlogDetailPage />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      {
        path: 'blog/write',
        element: (
          <ErrorBoundary>
            <PrivateRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <BlogWritePage />
              </Suspense>
            </PrivateRoute>
          </ErrorBoundary>
        ),
      },
      {
        path: 'mypage',
        element: (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <MyPage />
            </Suspense>
          </ErrorBoundary>
        ),
        children: [
          {
            index: true,
            element: (
              <PublicRoute>
                <MyPageForm />
              </PublicRoute>
            ),
          },
          {
            path: 'myprofile',
            element: (
              <PrivateRoute>
                <MyProfileForm />
              </PrivateRoute>
            ),
          },
          {
            path: 'editprofile',
            element: (
              <PrivateRoute>
                <EditProfileForm />
              </PrivateRoute>
            ),
          },
          {
            path: 'signup',
            element: (
              <PublicRoute>
                <SignupForm />
              </PublicRoute>
            ),
          },
        ],
      },
      {
        path: 'oauth/kakao/success',
        element: <KakaoLogin />,
      },
    ],
  },
  {
    path: '/analysis',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <AnalysisPage />
        </Suspense>
      </ErrorBoundary>
    ),
  },
]);

export default router;
