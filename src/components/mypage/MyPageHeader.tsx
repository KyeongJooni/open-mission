import { useState, useEffect } from 'react';
import { PostHeader, TextBox, TextField } from '@/components';
import { MYPAGE_TEXTS } from '@/constants';
import { SettingsIcon, EditProfileIcon } from '@/assets/icons';
import profileImage from '@/assets/profile.png';
import { MyPageHeaderProps } from '@/types/mypage';

const STYLES = {
  profileContent: 'flex flex-col w-full max-w-content py-3 px-4 items-start gap-2.5',
  profileImageWrapper: 'relative flex w-16 h-16 items-center gap-2.5 aspect-square',
  profileImage: 'w-full h-full object-cover rounded-full',
  profileEditIcon: 'absolute right-0 bottom-0 w-6 h-6 flex-shrink-0 z-10',
  profileEditFields: 'flex flex-col w-full max-w-content px-4 items-start',
  textFieldDivider: 'flex px-1.5 justify-center items-center gap-2.5 self-stretch mt-1',
  hintText: 'flex-1 text-gray-78 font-light text-xs leading-[160%]',
  profileActions: 'flex w-full max-w-content py-3 px-4 items-start gap-2.5',
} as const;

const MyPageHeader = ({
  isEditMode,
  nickname,
  bio,
  profilePicture,
  onNicknameChange,
  onBioChange,
  onEditClick,
  showSettingsButton = true,
  isEditProfilePage = false,
  previewImage: previewImageProp,
  fileInputRef: fileInputRefProp,
  handleImageUpload: handleImageUploadProp,
  handleProfileImageClick: handleProfileImageClickProp,
  validateField: validateFieldProp,
}: MyPageHeaderProps) => {
  const previewImage = previewImageProp || profilePicture || profileImage;
  const fileInputRef = fileInputRefProp || { current: null };
  const handleImageUpload = handleImageUploadProp || (() => {});
  const handleProfileImageClick = handleProfileImageClickProp || (() => {});
  const validateField = validateFieldProp || (() => undefined);

  const [nicknameError, setNicknameError] = useState<string | undefined>();
  const [bioError, setBioError] = useState<string | undefined>();

  useEffect(() => {
    if (!isEditMode) {
      setNicknameError(undefined);
      setBioError(undefined);
    }
  }, [isEditMode]);

  const handleNicknameChange = (value: string) => {
    onNicknameChange?.(value);
    const error = validateField('nickname', value);
    setNicknameError(error);
  };

  const handleBioChange = (value: string) => {
    onBioChange?.(value);
    const error = validateField('bio', value);
    setBioError(error);
  };

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
            value={nickname}
            onChange={e => handleNicknameChange(e.target.value)}
            placeholder={MYPAGE_TEXTS.PROFILE.NICKNAME_PLACEHOLDER}
            fullWidth
            fontSize="medium"
            textColor="title"
            disabled={!isEditMode}
            error={Boolean(nicknameError)}
            errorMessage={nicknameError}
          />
          <div className={STYLES.textFieldDivider}>
            <span className={STYLES.hintText}>{MYPAGE_TEXTS.PROFILE.NICKNAME_HINT}</span>
          </div>
          <TextField
            value={bio}
            onChange={e => handleBioChange(e.target.value)}
            placeholder={MYPAGE_TEXTS.PROFILE.BIO_PLACEHOLDER}
            fullWidth
            fontSize="light"
            textColor="gray78"
            className="mb-3 mt-3"
            disabled={!isEditMode}
            error={Boolean(bioError)}
            errorMessage={bioError}
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
