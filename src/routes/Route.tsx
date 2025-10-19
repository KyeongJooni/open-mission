import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/layout/Layout';
import MainPage from '@/pages/main/MainPage';
import BlogDetailPage from '@/pages/blog/BlogDetailPage';
import BlogWritePage from '@/pages/blog/BlogWritePage';
import MyPage from '@/pages/mypage/MyPage';
import KakaoLogin from '@/components/auth/KakaoLogin';
import { MyPageForm, MyProfileForm, EditProfileForm, SignupForm } from '@/components';
import Playground from '@/playground/Playground';
import { PublicRoute } from '@/routes/PublicRoute';
import { PrivateRoute } from '@/routes/PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: 'blog/:id',
        element: <BlogDetailPage />,
      },
      {
        path: 'blog/write',
        element: (
          <PrivateRoute>
            <BlogWritePage />
          </PrivateRoute>
        ),
      },
      {
        path: 'mypage',
        element: <MyPage />,
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
        path: 'playground',
        element: <Playground />,
      },
      {
        path: 'oauth/kakao/success',
        element: <KakaoLogin />,
      },
    ],
  },
]);

export default router;
