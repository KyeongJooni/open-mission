import { useState, useEffect } from 'react';
import { PostHeader, TextBox, TextField } from '@/components';
import { MYPAGE_TEXTS } from '@/constants';
import { SettingsIcon, EditProfileIcon } from '@/assets/icons';
import profileImage from '@/assets/profile.png';
import { MyPageHeaderProps } from '@/types/mypage';
import { STYLES } from './MyPageHeader.styles';

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
