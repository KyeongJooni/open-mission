import { z as zod } from 'zod';

export const VALIDATION_MESSAGES = {
  email: {
    required: '반드시 입력해야하는 필수 사항입니다.',
    invalid: '올바른 이메일 형식이 아닙니다',
  },
  password: {
    required: '비밀번호를 입력해주세요',
    minLength: '비밀번호는 최소 8자 이상이어야 합니다',
    maxLength: '비밀번호는 최대 64자 이하이어야 합니다',
    requireLetter: '비밀번호는 최소 1개의 영문자를 포함해야 합니다',
    requireNumber: '비밀번호는 최소 1개의 숫자를 포함해야 합니다',
    requireSpecial: '비밀번호는 최소 1개의 특수문자를 포함해야 합니다',
  },
  passwordConfirm: {
    required: '비밀번호 확인을 입력해주세요',
    mismatch: '비밀번호가 일치하지 않습니다',
  },
  name: {
    required: '반드시 입력해야하는 필수 사항입니다.',
    minLength: '이름은 최소 2자 이상이어야 합니다',
  },
  birthDate: {
    required: '생년월일을 입력해주세요',
    format: 'YYYY-MM-DD 형식으로 입력해주세요',
    invalidDate: '2025년 9월 1일 이전의 수만 가능합니다',
  },
  nickname: {
    required: '닉네임을 입력해주세요',
    minLength: '닉네임은 최소 2자 이상이어야 합니다',
    maxLength: '닉네임은 최대 20글자 입니다.',
    format: '닉네임은 영문, 숫자만 가능합니다.',
  },
  bio: {
    maxLength: '한 줄 소개는 최대 30글자입니다.',
  },
} as const;

export const validators = {
  email: () => zod.string().min(1, VALIDATION_MESSAGES.email.required).email(VALIDATION_MESSAGES.email.invalid),

  password: () =>
    zod
      .string()
      .min(1, VALIDATION_MESSAGES.password.required)
      .min(8, VALIDATION_MESSAGES.password.minLength)
      .max(64, VALIDATION_MESSAGES.password.maxLength)
      .regex(/[A-Za-z]/, VALIDATION_MESSAGES.password.requireLetter)
      .regex(/[0-9]/, VALIDATION_MESSAGES.password.requireNumber)
      .regex(/[!@#$%^&*(),.?":{}|<>]/, VALIDATION_MESSAGES.password.requireSpecial),

  passwordConfirm: () => zod.string().min(1, VALIDATION_MESSAGES.passwordConfirm.required),

  name: () => zod.string().min(1, VALIDATION_MESSAGES.name.required).min(2, VALIDATION_MESSAGES.name.minLength),

  birthDate: () =>
    zod
      .string()
      .min(1, VALIDATION_MESSAGES.birthDate.required)
      .regex(/^\d{4}-\d{2}-\d{2}$/, VALIDATION_MESSAGES.birthDate.format)
      .refine(
        date => {
          const inputDate = new Date(date);
          const maxDate = new Date('2025-09-01');
          return inputDate < maxDate;
        },
        { message: VALIDATION_MESSAGES.birthDate.invalidDate }
      ),

  nickname: () =>
    zod
      .string()
      .min(1, VALIDATION_MESSAGES.nickname.required)
      .min(2, VALIDATION_MESSAGES.nickname.minLength)
      .max(20, VALIDATION_MESSAGES.nickname.maxLength)
      .regex(/^[a-zA-Z0-9]+$/, VALIDATION_MESSAGES.nickname.format),

  bio: () => zod.string().max(100, VALIDATION_MESSAGES.bio.maxLength).optional().or(zod.literal('')),
} as const;
