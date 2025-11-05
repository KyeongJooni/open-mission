import { cn } from '@/utils/cn';
import { Outlet } from 'react-router-dom';
import { Spacer, PostHeader, MyPageHeader } from '@/components';
import { useMyPage, useEditProfile } from '@/hooks';
import * as UserQuery from '@/api/user/userQuery';

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
  const { isMyProfile, isEditProfile, isProfilePage, isEditMode, title, subtitle, spacerTopHeight, handleEditProfile } =
    useMyPage();

  const { user } = UserQuery.useAuth();
  const {
    headerNickname,
    headerIntroduction,
    setHeaderNickname,
    setHeaderIntroduction,
    previewImage,
    fileInputRef,
    handleImageUpload,
    handleProfileImageClick,
    validateField,
    handleSave,
  } = useEditProfile({ defaultProfileImage: user?.profilePicture });

  return (
    <div className={STYLES.wrapper}>
      <div className={cn(STYLES.container, className)}>
        <Spacer height={spacerTopHeight} className={isProfilePage ? STYLES.spacerTopProfile : STYLES.spacerTop} />
        {isProfilePage ? (
          <MyPageHeader
            isEditMode={isEditProfile && isEditMode}
            nickname={headerNickname}
            bio={headerIntroduction}
            profilePicture={user?.profilePicture}
            onNicknameChange={setHeaderNickname}
            onBioChange={setHeaderIntroduction}
            onEditClick={handleEditProfile}
            showSettingsButton={isMyProfile}
            isEditProfilePage={isEditProfile}
            previewImage={previewImage}
            fileInputRef={fileInputRef}
            handleImageUpload={handleImageUpload}
            handleProfileImageClick={handleProfileImageClick}
            validateField={validateField}
          />
        ) : (
          <PostHeader title={title} subtitle={subtitle} className="w-full px-1" />
        )}
        <Spacer height="sm" className={STYLES.spacerBottom} />
      </div>
      <Outlet context={{ headerNickname, headerIntroduction, handleSave }} />
    </div>
  );
};

export default MyPage;
