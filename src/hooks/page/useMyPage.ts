import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/api/user/userQuery';
import { useEditModeStore } from '@/stores/useEditModeStore';
import { MYPAGE_HEADER_CONTENT, MYPAGE_ROUTES } from '@/constants';

export const useMyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = useEditModeStore(state => state.isEditMode);

  // 라우팅 상태
  const isMyProfile = location.pathname === MYPAGE_ROUTES.MY_PROFILE;
  const isEditProfile = location.pathname === MYPAGE_ROUTES.EDIT_PROFILE;
  const isProfilePage = isMyProfile || isEditProfile;

  // 헤더 컨텐츠
  const { title, subtitle } =
    MYPAGE_HEADER_CONTENT[location.pathname as keyof typeof MYPAGE_HEADER_CONTENT] ||
    MYPAGE_HEADER_CONTENT[MYPAGE_ROUTES.BASE];

  // 스페이서 높이
  const spacerTopHeight: 'lg' | 'md' = isProfilePage ? 'lg' : 'md';

  // 네비게이션 핸들러
  const handleEditProfile = () => {
    navigate(MYPAGE_ROUTES.EDIT_PROFILE);
  };

  return {
    // 라우팅 상태
    isMyProfile,
    isEditProfile,
    isProfilePage,

    // 사용자 정보
    user,
    isEditMode,

    // 헤더 정보
    title,
    subtitle,
    spacerTopHeight,

    // 핸들러
    handleEditProfile,
  };
};
