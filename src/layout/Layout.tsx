import Sidebar from '@/layout/Sidebar';
import { PageHeader, PageTransition } from '@/components';
import { useSidebar, usePageHeaderType, useEditProfile } from '@/hooks';
import { useAuthStore } from '@/stores/useAuthStore';

export default function Layout() {
  const { isSidebarOpen, sidebarRef, toggleSidebar } = useSidebar();
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  const pageHeaderType = usePageHeaderType();
  const { handleEdit, handleCancel } = useEditProfile();

  return (
    <div className="w-full">
      <PageHeader type={pageHeaderType} onHamburgerClick={toggleSidebar} onEdit={handleEdit} onCancel={handleCancel} />
      <div ref={sidebarRef} className={`sidebar-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar isLoggedIn={isLoggedIn} />
      </div>
      <div className="w-full pt-16">
        <PageTransition />
      </div>
    </div>
  );
}
