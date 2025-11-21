import { signupSchema, profileEditSchema } from '../schemas';
import { VALIDATION_MESSAGES } from '../validation';

describe('signupSchema', () => {
  const validData = {
    email: 'test@example.com',
    password: 'Password1!',
    passwordConfirm: 'Password1!',
    name: '홍길동',
    birthDate: '1990-01-01',
    nickname: 'testuser',
    introduction: '안녕하세요',
  };

  describe('유효한 데이터', () => {
    it('모든 필드가 유효하면 통과해야 함', () => {
      const result = signupSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('introduction이 빈 문자열이어도 통과해야 함', () => {
      const result = signupSchema.safeParse({
        ...validData,
        introduction: '',
      });
      expect(result.success).toBe(true);
    });

    it('introduction이 undefined여도 통과해야 함', () => {
      const data = { ...validData };
      delete (data as Record<string, unknown>).introduction;
      const result = signupSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('비밀번호 확인 일치', () => {
    it('비밀번호가 일치하면 통과해야 함', () => {
      const result = signupSchema.safeParse({
        ...validData,
        password: 'Test1234!',
        passwordConfirm: 'Test1234!',
      });
      expect(result.success).toBe(true);
    });

    it('비밀번호가 불일치하면 실패해야 함', () => {
      const result = signupSchema.safeParse({
        ...validData,
        password: 'Password1!',
        passwordConfirm: 'Different1!',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.passwordConfirm.mismatch);
        expect(result.error.issues[0].path).toContain('passwordConfirm');
      }
    });
  });

  describe('필드별 검증', () => {
    it.each([
      ['email', '', VALIDATION_MESSAGES.email.required],
      ['password', '', VALIDATION_MESSAGES.password.required],
      ['passwordConfirm', '', VALIDATION_MESSAGES.passwordConfirm.required],
      ['name', '', VALIDATION_MESSAGES.name.required],
      ['birthDate', '', VALIDATION_MESSAGES.birthDate.required],
      ['nickname', '', VALIDATION_MESSAGES.nickname.required],
    ])('%s 필드가 비어있으면 실패해야 함', (field, value, expectedMessage) => {
      const result = signupSchema.safeParse({
        ...validData,
        [field]: value,
        ...(field === 'password' ? { passwordConfirm: value } : {}),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(i => i.path.includes(field));
        expect(issue?.message).toBe(expectedMessage);
      }
    });
  });

  describe('복합 검증', () => {
    it('여러 필드가 유효하지 않으면 모든 에러를 반환해야 함', () => {
      const result = signupSchema.safeParse({
        email: '',
        password: '',
        passwordConfirm: '',
        name: '',
        birthDate: '',
        nickname: '',
        introduction: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1);
      }
    });

    it('이메일 형식과 비밀번호 복잡성을 동시에 검증해야 함', () => {
      const result = signupSchema.safeParse({
        ...validData,
        email: 'invalid-email',
        password: '123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const hasEmailError = result.error.issues.some(i => i.path.includes('email'));
        const hasPasswordError = result.error.issues.some(i => i.path.includes('password'));
        expect(hasEmailError).toBe(true);
        expect(hasPasswordError).toBe(true);
      }
    });
  });

  describe('타입 추론', () => {
    it('올바른 타입을 추론해야 함', () => {
      const result = signupSchema.safeParse(validData);
      if (result.success) {
        const data = result.data;
        expect(typeof data.email).toBe('string');
        expect(typeof data.password).toBe('string');
        expect(typeof data.name).toBe('string');
        expect(typeof data.birthDate).toBe('string');
        expect(typeof data.nickname).toBe('string');
      }
    });
  });
});

describe('profileEditSchema', () => {
  const validData = {
    email: 'test@example.com',
    name: '홍길동',
    birthDate: '1990-01-01',
    nickname: 'testuser',
    introduction: '안녕하세요',
  };

  describe('password 필드 제외', () => {
    it('password 필드 없이 통과해야 함', () => {
      const result = profileEditSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('passwordConfirm 필드 없이 통과해야 함', () => {
      const result = profileEditSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('password 필드가 있으면 무시해야 함', () => {
      const result = profileEditSchema.safeParse({
        ...validData,
        password: 'ShouldBeIgnored1!',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect('password' in result.data).toBe(false);
      }
    });
  });

  describe('필드 검증', () => {
    it.each([
      ['email', ''],
      ['name', ''],
      ['birthDate', ''],
      ['nickname', ''],
    ])('%s 필드가 비어있으면 실패해야 함', (field, value) => {
      const result = profileEditSchema.safeParse({
        ...validData,
        [field]: value,
      });
      expect(result.success).toBe(false);
    });

    it('introduction이 빈 문자열이어도 통과해야 함', () => {
      const result = profileEditSchema.safeParse({
        ...validData,
        introduction: '',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('필드별 유효성', () => {
    it('잘못된 이메일 형식은 실패해야 함', () => {
      const result = profileEditSchema.safeParse({
        ...validData,
        email: 'invalid',
      });
      expect(result.success).toBe(false);
    });

    it('잘못된 생년월일 형식은 실패해야 함', () => {
      const result = profileEditSchema.safeParse({
        ...validData,
        birthDate: '1990/01/01',
      });
      expect(result.success).toBe(false);
    });

    it('특수문자 닉네임은 실패해야 함', () => {
      const result = profileEditSchema.safeParse({
        ...validData,
        nickname: 'test_user',
      });
      expect(result.success).toBe(false);
    });

    it('100자 초과 소개글은 실패해야 함', () => {
      const result = profileEditSchema.safeParse({
        ...validData,
        introduction: 'a'.repeat(101),
      });
      expect(result.success).toBe(false);
    });
  });
});
