import { PostHeader, TextBox, TextField } from '@/components';
import { MYPAGE_TEXTS } from '@/constants';
import { SettingsIcon, EditProfileIcon } from '@/assets/icons';
import profileImage from '@/assets/profile.png';
import { MyPageHeaderProps } from '@/types/mypage';
import { useEditProfile } from '@/hooks';

const STYLES = {
  profileContent: 'flex flex-col w-full max-w-content py-3 px-4 items-start gap-2.5',
  profileImageWrapper: 'relative flex w-16 h-16 items-center gap-2.5 aspect-square rounded-full overflow-hidden',
  profileImage: 'w-full h-full object-cover',
  profileEditIcon: 'absolute right-0 bottom-0 w-6 h-6 flex-shrink-0',
  profileEditFields: 'flex flex-col w-full max-w-content px-4 items-start',
  textFieldDivider: 'flex px-1.5 justify-center items-center gap-2.5 self-stretch mt-1',
  hintText: 'flex-1 text-gray-78 font-light text-xs leading-[160%]',
  profileActions: 'flex w-full max-w-content py-3 px-4 items-start gap-2.5',
} as const;

const MyPageHeader = ({
  isEditMode,
  nickname,
  bio,
  onEditClick,
  showSettingsButton = true,
  isEditProfilePage = false,
}: MyPageHeaderProps) => {
  const {
    register,
    errors,
    watchedNickname,
    watchedBio,
    previewImage,
    fileInputRef,
    handleImageUpload,
    handleProfileImageClick,
  } = useEditProfile({
    nickname,
    bio,
    isEditMode,
    defaultProfileImage: profileImage,
  });

  return (
    <>
      <div className={STYLES.profileContent}>
        <div className={STYLES.profileImageWrapper}>
          <img src={previewImage || profileImage} alt="Profile" className={STYLES.profileImage} />
          {isEditMode && (
            <>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <button
                type="button"
                onClick={handleProfileImageClick}
                className={STYLES.profileEditIcon}
                aria-label="프로필 사진 변경"
              >
                <EditProfileIcon />
              </button>
            </>
          )}
        </div>
      </div>

      {isEditProfilePage ? (
        <div className={STYLES.profileEditFields}>
          <TextField
            {...register('nickname')}
            value={watchedNickname}
            placeholder={MYPAGE_TEXTS.PROFILE.NICKNAME_PLACEHOLDER}
            fullWidth
            fontSize="medium"
            textColor="title"
            disabled={!isEditMode}
            error={Boolean(errors.nickname?.message)}
            errorMessage={errors.nickname?.message}
          />
          <div className={STYLES.textFieldDivider}>
            <span className={STYLES.hintText}>{MYPAGE_TEXTS.PROFILE.NICKNAME_HINT}</span>
          </div>
          <TextField
            {...register('bio')}
            value={watchedBio}
            placeholder={MYPAGE_TEXTS.PROFILE.BIO_PLACEHOLDER}
            fullWidth
            fontSize="light"
            textColor="gray78"
            className="mb-3 mt-3"
            disabled={!isEditMode}
            error={Boolean(errors.bio?.message)}
            errorMessage={errors.bio?.message}
          />
        </div>
      ) : (
        <PostHeader title={nickname} subtitle={bio} className="w-full px-1" />
      )}

      {!isEditMode && showSettingsButton && (
        <div className={STYLES.profileActions}>
          <TextBox
            showIcon
            icon={<SettingsIcon />}
            color="gray-56"
            borderColor="gray-90"
            onClick={onEditClick}
            asButton
          >
            {MYPAGE_TEXTS.PROFILE.SETTINGS}
          </TextBox>
        </div>
      )}
    </>
  );
};

export default MyPageHeader;
