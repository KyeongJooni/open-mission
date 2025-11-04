import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOutletContext } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { Spacer, Textarea } from '@/components';
import * as UserQuery from '@/api/user/userQuery';
import { useEditModeStore } from '@/stores/useEditModeStore';
import { useEditProfile } from '@/hooks';
import { SIGNUP_FORM_FIELDS } from '@/constants';
import { signupSchema, SignupFormData } from '@/utils/schemas';
import { EditProfileFormProps } from '@/types/mypage';

const STYLES = {
  container: 'flex flex-col items-center self-stretch',
  spacer: 'w-full max-w-content',
  textareaCommon: 'w-full max-w-content px-0',
} as const;

const DISABLED_FIELDS = ['email', 'name'];
const EXCLUDED_FIELDS = ['nickname', 'introduction'];

const EditProfileForm = ({ className }: EditProfileFormProps) => {
  const { user } = UserQuery.useAuth();
  const { isEditMode, setEditMode } = useEditModeStore();
  const { headerNickname, headerIntroduction } = useOutletContext<{
    headerNickname: string;
    headerIntroduction: string;
  }>();

  useEffect(() => {
    // 초기화
    return () => {
      setEditMode(false);
    };
  }, [setEditMode]);

  // 필드 활성화/비활성화
  const isFieldDisabled = (fieldName: string) => {
    if (!isEditMode) {
      return true;
    }
    return DISABLED_FIELDS.includes(fieldName);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      email: user?.email || '',
      password: '',
      passwordConfirm: '',
      name: user?.name || '',
      birthDate: user?.birthDate || '',
      nickname: user?.nickname || '',
      introduction: user?.introduction || '',
    },
  });

  const { handleSave } = useEditProfile();

  // 초기값 리셋
  useEffect(() => {
    if (!isEditMode) {
      reset({
        email: user?.email || '',
        password: '',
        passwordConfirm: '',
        name: user?.name || '',
        birthDate: user?.birthDate || '',
        nickname: user?.nickname || '',
        introduction: user?.introduction || '',
      });
    }
  }, [isEditMode, user, reset]);

  const onSubmit = (data: SignupFormData) => {
    // MyPageHeader에서 입력한 nickname과 introduction을 병합
    const mergedData = {
      ...data,
      nickname: headerNickname,
      introduction: headerIntroduction,
    };
    handleSave(mergedData);
  };

  return (
    <form id="edit-profile-form" onSubmit={handleSubmit(onSubmit)} className={cn(STYLES.container, className)}>
      <Spacer height="md" className={STYLES.spacer} />

      {SIGNUP_FORM_FIELDS.filter(field => !EXCLUDED_FIELDS.includes(field.name)).map(field => {
        const isDisabled = isFieldDisabled(field.name);
        const isAlwaysDisabled = DISABLED_FIELDS.includes(field.name);
        const isPasswordField = field.name === 'password' || field.name === 'passwordConfirm';
        const placeholder = !isEditMode && isPasswordField ? '******' : field.placeholder;

        return (
          <Textarea
            key={field.name}
            title={field.title}
            type={field.type}
            placeholder={placeholder}
            hintText={field.hintText}
            error={errors[field.name]?.message}
            textFieldBackgroundColor={isAlwaysDisabled ? 'filled' : undefined}
            disabled={isDisabled}
            className={STYLES.textareaCommon}
            {...register(field.name)}
          />
        );
      })}

      <Spacer height="md" className={STYLES.spacer} />
    </form>
  );
};

export default EditProfileForm;
