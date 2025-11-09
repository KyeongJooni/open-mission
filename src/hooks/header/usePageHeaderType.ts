import { useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { PageHeaderType } from '@/types/pageheader';

export const usePageHeaderType = (): PageHeaderType => {
  const location = useLocation();

  if (location.pathname === ROUTES.HOME) {
    return 'main';
  }

  if (location.pathname.includes('/write')) {
    return 'write';
  }

  if (location.pathname === ROUTES.MYPAGE.MY_PROFILE) {
    return 'main';
  }

  if (location.pathname === ROUTES.MYPAGE.EDIT_PROFILE) {
    return 'editprofile';
  }

  if (location.pathname.startsWith('/mypage')) {
    return 'mypage';
  }

  return 'detail';
};
