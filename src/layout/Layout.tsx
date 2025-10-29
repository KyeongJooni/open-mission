import Sidebar from '@/layout/Sidebar';
import { PageHeader } from '@/components';
import { useSidebar, usePageHeaderType, useEditProfile } from '@/hooks';
import { useAuthStore } from '@/stores/useAuthStore';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import {
  mockPostDetail,
  mockPostDetailNoComments,
  mockPostDetailWithMyComments,
  mockPostDetailByHongGilDong,
} from '@/_mocks_/mockPostDetail';

export default function Layout() {
  const { isSidebarOpen, sidebarRef, toggleSidebar } = useSidebar();
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  const pageHeaderType = usePageHeaderType();
  const { handleEdit, handleCancel, handleSave } = useEditProfile();
  const { id } = useParams();
  const location = useLocation();

  // 블로그 상세 페이지에서만 isOwner 계산, 삭제예정
  const isOwner =
    location.pathname.includes('/blog/') && id
      ? id === '1001'
        ? mockPostDetailByHongGilDong.isOwner
        : id === '998'
          ? mockPostDetailNoComments.isOwner
          : id === '997'
            ? mockPostDetailWithMyComments.isOwner
            : mockPostDetail.isOwner
      : undefined;

  return (
    <div className="w-full">
      <PageHeader
        type={pageHeaderType}
        onHamburgerClick={toggleSidebar}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
        isOwner={isOwner}
      />
      <div ref={sidebarRef} className={`sidebar-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar isLoggedIn={isLoggedIn} />
      </div>
      <div className="flex w-full flex-col items-center pt-16">
        <Outlet />
      </div>
    </div>
  );
}
