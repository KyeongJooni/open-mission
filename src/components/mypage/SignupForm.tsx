import { FC } from 'react';
import { Spacer, Button, Modal } from '@/components';
import LoginModal from '@/components/auth/LoginModal';
import SignupProfileSection from './SignupProfileSection';
import SignupFormFields from './SignupFormFields';
import { signupFormStyles } from './SignupForm.styles';
import { useSignup } from '@/hooks';
import { MYPAGE_TEXTS, SIGNUP_FORM_FIELDS } from '@/constants';
import profileImage from '@/assets/profile.png';
import { SignupFormProps } from '@/types/mypage';

const SignupForm: FC<SignupFormProps> = ({ className }) => {
  const {
    previewImage,
    fileInputRef,
    handleImageUpload,
    handleButtonClick,
    form: {
      register,
      handleSubmit,
      formState: { errors },
    },
    onSubmit,
    handleLoginRedirect,
    isCompleteModalOpen,
    setIsCompleteModalOpen,
    isLoginModalOpen,
    setIsLoginModalOpen,
    isKakaoSignup,
  } = useSignup(profileImage);

  const styles = signupFormStyles();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container({ className })}>
      <SignupProfileSection
        previewImage={previewImage}
        fileInputRef={fileInputRef}
        handleImageUpload={handleImageUpload}
        handleButtonClick={handleButtonClick}
        styles={styles}
      />
      <SignupFormFields fields={SIGNUP_FORM_FIELDS} isKakaoSignup={isKakaoSignup} register={register} errors={errors} styles={styles} />
      <Spacer height="md" className={styles.spacer()} />
      <div className={styles.buttonWrapper()}>
        <Button type="submit" intent="primary" variant="solid" fullWidth>
          {MYPAGE_TEXTS.BUTTONS.SIGNUP_SUBMIT}
        </Button>
      </div>
      <Spacer height="lg" className={styles.spacer()} />
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        confirmButtonText={MYPAGE_TEXTS.BUTTONS.LOGIN_REDIRECT}
        confirmButtonVariant="primary"
        onDelete={handleLoginRedirect}
      >
        <p className="text-center text-sm">{MYPAGE_TEXTS.MODAL.SIGNUP_COMPLETE}</p>
      </Modal>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </form>
  );
};

export default SignupForm;
