import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/utils/cn';
import { Spacer, Textarea } from '@/components';
import { useAuth } from '@/api/user/userQuery';
import { useEditModeStore } from '@/stores/useEditModeStore';
import { SIGNUP_FORM_FIELDS } from '@/constants';
import { signupSchema, SignupFormData } from '@/utils/schemas';
import { EditProfileFormProps } from '@/types/mypage';

const STYLES = {
  container: 'flex flex-col items-center self-stretch',
  spacer: 'w-full max-w-content',
  textareaCommon: 'w-full max-w-content px-0',
} as const;

const DISABLED_FIELDS = ['email', 'name'];
const EXCLUDED_FIELDS = ['nickname', 'bio'];

const EditProfileForm = ({ className }: EditProfileFormProps) => {
  const { user } = useAuth();
  const { isEditMode, setEditMode } = useEditModeStore();

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
      bio: user?.introduction || '',
    },
  });

  // 초기값으로 리셋
  useEffect(() => {
    if (!isEditMode) {
      reset({
        email: user?.email || '',
        password: '',
        passwordConfirm: '',
        name: user?.name || '',
        birthDate: user?.birthDate || '',
        nickname: user?.nickname || '',
        bio: user?.introduction || '',
      });
    }
  }, [isEditMode, user, reset]);

  const onSubmit = (_data: SignupFormData) => {
    // TODO: API 호출로 프로필 업데이트
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(STYLES.container, className)}>
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
