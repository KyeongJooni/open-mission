import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/layout/Layout';
import { LoadingSpinner, MyPageForm, MyProfileForm, EditProfileForm, SignupForm } from '@/components';
import KakaoLogin from '@/components/auth/KakaoLogin';
import { PublicRoute } from '@/routes/PublicRoute';
import { PrivateRoute } from '@/routes/PrivateRoute';

const MainPage = lazy(() => import('@/pages/main/MainPage'));
const BlogDetailPage = lazy(() => import('@/pages/blog/BlogDetailPage'));
const BlogWritePage = lazy(() => import('@/pages/blog/BlogWritePage'));
const MyPage = lazy(() => import('@/pages/mypage/MyPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <MainPage />
          </Suspense>
        ),
      },
      {
        path: 'blog/:id',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <BlogDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'blog/write',
        element: (
          <PrivateRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <BlogWritePage />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: 'mypage',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <MyPage />
          </Suspense>
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
]);

export default router;
