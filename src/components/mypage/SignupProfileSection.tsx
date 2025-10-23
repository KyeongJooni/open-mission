import { RefObject, ChangeEvent } from 'react';
import { Spacer, TextBox } from '@/components';
import { AddPhotoAlternateIcon } from '@/assets/icons';
import { MYPAGE_TEXTS } from '@/constants';
import { SignupFormStyles } from './SignupForm.styles';

interface ProfileSectionProps {
  previewImage: string;
  fileInputRef: RefObject<HTMLInputElement>;
  handleImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  handleButtonClick: () => void;
  styles: SignupFormStyles;
}

const ProfileSection = ({
  previewImage,
  fileInputRef,
  handleImageUpload,
  handleButtonClick,
  styles,
}: ProfileSectionProps) => {
  return (
    <>
      <Spacer height="md" className={styles.spacer()} />
      <div className={styles.profileSection()}>
        <div className={styles.sectionTitle()}>
          <span className="flex-1 text-sm font-light text-gray-56">{MYPAGE_TEXTS.LABELS.PROFILE_PHOTO}</span>
        </div>
        <div className={styles.profileContent()}>
          <div className={styles.profileImage()}>
            <img src={previewImage} alt="Profile" className={styles.image()} />
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <TextBox
            showIcon
            icon={<AddPhotoAlternateIcon />}
            color="gray-90"
            borderColor="gray-90"
            onClick={handleButtonClick}
          >
            {MYPAGE_TEXTS.BUTTONS.ADD_PROFILE_PHOTO}
          </TextBox>
        </div>
      </div>
    </>
  );
};

export default ProfileSection;
