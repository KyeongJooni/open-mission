import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOutletContext } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { Spacer, Textarea } from '@/components';
import * as UserQuery from '@/api/user/userQuery';
import { useEditModeStore } from '@/stores/useEditModeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { SIGNUP_FORM_FIELDS, MYPAGE_TEXTS } from '@/constants';
import { profileEditSchema, ProfileEditFormData } from '@/utils/schemas';
import { EditProfileFormProps } from '@/types/mypage';
import KakaoIcon from '@/assets/icons/common/kakao.svg?react';

const STYLES = {
  container: 'flex flex-col items-center self-stretch',
  spacer: 'w-full max-w-content',
  textareaCommon: 'w-full max-w-content px-0',
  kakaoEmailField: 'flex w-full max-w-content flex-col items-start gap-2 py-3 px-4',
  kakaoEmailTitle: 'text-sm font-light text-gray-56',
  kakaoEmailBox:
    'flex w-full items-center gap-2 rounded px-4 py-3 border border-gray-90 bg-gray-90 text-sm text-gray-56',
} as const;

const DISABLED_FIELDS = ['email', 'name'];
const EXCLUDED_FIELDS = ['nickname', 'introduction', 'password', 'passwordConfirm'];

const EditProfileForm = ({ className }: EditProfileFormProps) => {
  const { user } = UserQuery.useAuth();
  const { isEditMode, setEditMode } = useEditModeStore();
  const isKakaoUser = useAuthStore(state => state.isKakaoUser);
  const { headerNickname, headerIntroduction, handleSave } = useOutletContext<{
    headerNickname: string;
    headerIntroduction: string;
    handleSave: (
      data: Partial<{ nickname: string; introduction: string; email: string; name: string; birthDate: string }>
    ) => void;
  }>();

  // 컴포넌트 unmount 시 편집 모드 종료
  useEffect(() => {
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
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    mode: 'onChange',
    defaultValues: {
      email: user?.email || '',
      name: user?.name || '',
      birthDate: user?.birthDate || '',
      nickname: user?.nickname || '',
      introduction: user?.introduction || '',
    },
  });

  // 초기값 리셋
  useEffect(() => {
    if (!isEditMode) {
      reset({
        email: user?.email || '',
        name: user?.name || '',
        birthDate: user?.birthDate || '',
        nickname: user?.nickname || '',
        introduction: user?.introduction || '',
      });
    }
  }, [isEditMode, user, reset]);

  const onSubmit = (data: ProfileEditFormData) => {
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

      {isKakaoUser && (
        <div className={STYLES.kakaoEmailField}>
          <span className={STYLES.kakaoEmailTitle}>{MYPAGE_TEXTS.LABELS.SOCIAL_LOGIN}</span>
          <div className={STYLES.kakaoEmailBox}>
            <KakaoIcon width={18} height={18} />
            {MYPAGE_TEXTS.LABELS.KAKAO_LOGIN}
          </div>
        </div>
      )}

      {SIGNUP_FORM_FIELDS.filter(field => !EXCLUDED_FIELDS.includes(field.name)).map(field => {
        const isDisabled = isFieldDisabled(field.name);
        const isAlwaysDisabled = DISABLED_FIELDS.includes(field.name);

        return (
          <Textarea
            key={field.name}
            title={field.title}
            type={field.type}
            placeholder={field.placeholder}
            hintText={field.hintText}
            error={errors[field.name as keyof ProfileEditFormData]?.message}
            textFieldBackgroundColor={isAlwaysDisabled ? 'filled' : undefined}
            disabled={isDisabled}
            className={STYLES.textareaCommon}
            {...register(field.name as keyof ProfileEditFormData)}
          />
        );
      })}

      <Spacer height="md" className={STYLES.spacer} />
    </form>
  );
};

export default EditProfileForm;
