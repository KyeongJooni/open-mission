import { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { Outlet } from 'react-router-dom';
import { Spacer, PostHeader, MyPageHeader } from '@/components';
import { useMyPage } from '@/hooks';

interface MyPageProps {
  className?: string;
}

const STYLES = {
  wrapper: 'flex w-full flex-col items-center',
  container: 'flex w-full flex-col items-center justify-center self-stretch border-b border-gray-96 bg-gray-96',
  spacerTop: 'w-full max-w-content max-md:h-spacer-mobile-top',
  spacerTopProfile: 'w-full max-w-content max-md:!h-8',
  spacerBottom: 'w-full max-w-content max-md:h-3',
} as const;

const MyPage = ({ className }: MyPageProps) => {
  const {
    isMyProfile,
    isEditProfile,
    isProfilePage,
    user,
    isEditMode,
    title,
    subtitle,
    spacerTopHeight,
    handleEditProfile,
  } = useMyPage();

  // EditProfile 페이지에서 MyPageHeader와 EditProfileForm이 공유할 state
  const [headerNickname, setHeaderNickname] = useState(user?.nickname || '');
  const [headerIntroduction, setHeaderIntroduction] = useState(user?.introduction || '');

  // user 정보가 변경되면 state 업데이트
  useEffect(() => {
    if (user) {
      setHeaderNickname(user.nickname);
      setHeaderIntroduction(user.introduction || '');
    }
  }, [user]);

  return (
    <div className={STYLES.wrapper}>
      <div className={cn(STYLES.container, className)}>
        <Spacer height={spacerTopHeight} className={isProfilePage ? STYLES.spacerTopProfile : STYLES.spacerTop} />
        {isProfilePage ? (
          <MyPageHeader
            isEditMode={isEditProfile && isEditMode}
            nickname={headerNickname}
            bio={headerIntroduction}
            onNicknameChange={setHeaderNickname}
            onBioChange={setHeaderIntroduction}
            onEditClick={handleEditProfile}
            showSettingsButton={isMyProfile}
            isEditProfilePage={isEditProfile}
          />
        ) : (
          <PostHeader title={title} subtitle={subtitle} className="w-full px-1" />
        )}
        <Spacer height="sm" className={STYLES.spacerBottom} />
      </div>
      <Outlet context={{ headerNickname, headerIntroduction }} />
    </div>
  );
};

export default MyPage;
