import type { SignupFormData } from '@/utils/schemas';

interface User {
  email: string;
  nickname: string;
  profilePicture: string;
  birthDate: string;
  name: string;
  introduction?: string;
}

interface ProfileChange {
  field: string;
  value: string | undefined;
}

export const detectProfileChanges = (data: Partial<SignupFormData>, user: User): ProfileChange[] => {
  const fieldChecks = [
    {
      field: 'nickname',
      hasChanged: () => data.nickname && data.nickname !== user.nickname,
      value: data.nickname,
    },
    {
      field: 'introduction',
      hasChanged: () => data.introduction !== undefined && data.introduction !== user.introduction,
      value: data.introduction,
    },
    {
      field: 'birthDate',
      hasChanged: () => data.birthDate && data.birthDate !== user.birthDate,
      value: data.birthDate,
    },
  ];

  return fieldChecks.filter(check => check.hasChanged()).map(check => ({ field: check.field, value: check.value }));
};

export const getUpdateStrategy = (
  changes: ProfileChange[]
): { type: 'single' | 'multiple' | 'none'; field?: string; value?: string } => {
  if (changes.length === 0) {
    return { type: 'none' };
  }

  if (changes.length === 1) {
    const { field, value } = changes[0];
    if (field === 'nickname') {
      return { type: 'single', field, value };
    }
  }

  return { type: 'multiple' };
};

export const buildUpdateRequest = (data: Partial<SignupFormData>, user: User) => {
  return {
    email: data.email || user.email,
    nickname: data.nickname || user.nickname,
    profilePicture: user.profilePicture,
    birthDate: data.birthDate || user.birthDate,
    name: data.name || user.name,
    introduction: data.introduction || '',
  };
};
