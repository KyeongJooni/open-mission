import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Textarea } from '@/components';
import { MYPAGE_TEXTS } from '@/constants';
import { SignupFormData } from '@/utils/schemas';
import { SignupFormStyles } from './SignupForm.styles';
import KakaoIcon from '@/assets/icons/common/kakao.svg?react';

interface FormField {
  name: 'email' | 'password' | 'passwordConfirm' | 'name' | 'birthDate' | 'nickname' | 'bio';
  title: string;
  type?: 'email' | 'password';
  placeholder: string;
  hintText: string | undefined;
}

interface SignupFormFieldsProps {
  fields: readonly FormField[];
  isKakaoSignup: boolean;
  register: UseFormRegister<SignupFormData>;
  errors: FieldErrors<SignupFormData>;
  styles: SignupFormStyles;
}

const SignupFormFields = ({ fields, isKakaoSignup, register, errors, styles }: SignupFormFieldsProps) => {
  return (
    <>
      {isKakaoSignup && (
        <div className={styles.kakaoEmailField()}>
          <span className={styles.kakaoEmailTitle()}>{MYPAGE_TEXTS.LABELS.SOCIAL_LOGIN}</span>
          <div className={styles.kakaoEmailBox()}>
            <KakaoIcon width={18} height={18} />
            {MYPAGE_TEXTS.LABELS.KAKAO_LOGIN}
          </div>
        </div>
      )}
      {fields.map(field => (
        <Textarea
          key={field.name}
          title={field.title}
          type={field.type}
          placeholder={field.placeholder}
          hintText={field.hintText}
          error={errors[field.name]?.message}
          className={styles.textareaCommon()}
          {...register(field.name)}
        />
      ))}
    </>
  );
};

export default SignupFormFields;
