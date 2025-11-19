import { validators, VALIDATION_MESSAGES } from '../validation';

describe('validators', () => {
  describe('email', () => {
    const emailValidator = validators.email();

    it('유효한 이메일을 통과시켜야 함', () => {
      expect(emailValidator.safeParse('test@example.com').success).toBe(true);
      expect(emailValidator.safeParse('user.name+tag@example.co.kr').success).toBe(true);
      expect(emailValidator.safeParse('test123@test.com').success).toBe(true);
    });

    it('빈 문자열은 실패해야 함', () => {
      const result = emailValidator.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.email.required);
      }
    });

    it('잘못된 이메일 형식은 실패해야 함', () => {
      const result = emailValidator.safeParse('invalid-email');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.email.invalid);
      }
    });

    it('@ 없는 이메일은 실패해야 함', () => {
      const result = emailValidator.safeParse('test.com');
      expect(result.success).toBe(false);
    });

    it('도메인 없는 이메일은 실패해야 함', () => {
      const result = emailValidator.safeParse('test@');
      expect(result.success).toBe(false);
    });
  });

  describe('password', () => {
    const passwordValidator = validators.password();

    it('유효한 비밀번호를 통과시켜야 함', () => {
      expect(passwordValidator.safeParse('Password1!').success).toBe(true);
      expect(passwordValidator.safeParse('MyP@ssw0rd').success).toBe(true);
      expect(passwordValidator.safeParse('Test1234!@#$').success).toBe(true);
    });

    it('빈 문자열은 실패해야 함', () => {
      const result = passwordValidator.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.password.required);
      }
    });

    it('8자 미만은 실패해야 함', () => {
      const result = passwordValidator.safeParse('Pass1!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.password.minLength);
      }
    });

    it('64자 초과는 실패해야 함', () => {
      const longPassword = 'P'.repeat(60) + '1!abc'; // 65자
      const result = passwordValidator.safeParse(longPassword);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.password.maxLength);
      }
    });

    it('영문자 없으면 실패해야 함', () => {
      const result = passwordValidator.safeParse('12345678!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(e => e.message === VALIDATION_MESSAGES.password.requireLetter)).toBe(true);
      }
    });

    it('숫자 없으면 실패해야 함', () => {
      const result = passwordValidator.safeParse('Password!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(e => e.message === VALIDATION_MESSAGES.password.requireNumber)).toBe(true);
      }
    });

    it('특수문자 없으면 실패해야 함', () => {
      const result = passwordValidator.safeParse('Password1');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(e => e.message === VALIDATION_MESSAGES.password.requireSpecial)).toBe(true);
      }
    });

    it('다양한 특수문자를 허용해야 함', () => {
      expect(passwordValidator.safeParse('Password1!').success).toBe(true);
      expect(passwordValidator.safeParse('Password1@').success).toBe(true);
      expect(passwordValidator.safeParse('Password1#').success).toBe(true);
      expect(passwordValidator.safeParse('Password1$').success).toBe(true);
      expect(passwordValidator.safeParse('Password1%').success).toBe(true);
    });
  });

  describe('passwordConfirm', () => {
    const passwordConfirmValidator = validators.passwordConfirm();

    it('비어있지 않은 문자열을 통과시켜야 함', () => {
      expect(passwordConfirmValidator.safeParse('anyPassword').success).toBe(true);
    });

    it('빈 문자열은 실패해야 함', () => {
      const result = passwordConfirmValidator.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.passwordConfirm.required);
      }
    });
  });

  describe('name', () => {
    const nameValidator = validators.name();

    it('유효한 이름을 통과시켜야 함', () => {
      expect(nameValidator.safeParse('홍길동').success).toBe(true);
      expect(nameValidator.safeParse('김철수').success).toBe(true);
      expect(nameValidator.safeParse('John').success).toBe(true);
    });

    it('빈 문자열은 실패해야 함', () => {
      const result = nameValidator.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.name.required);
      }
    });

    it('1자는 실패해야 함', () => {
      const result = nameValidator.safeParse('김');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.name.minLength);
      }
    });

    it('2자 이상은 통과해야 함', () => {
      expect(nameValidator.safeParse('김철').success).toBe(true);
    });
  });

  describe('birthDate', () => {
    const birthDateValidator = validators.birthDate();

    it('유효한 날짜 형식을 통과시켜야 함', () => {
      expect(birthDateValidator.safeParse('1990-01-01').success).toBe(true);
      expect(birthDateValidator.safeParse('2000-12-31').success).toBe(true);
      expect(birthDateValidator.safeParse('1985-06-15').success).toBe(true);
    });

    it('빈 문자열은 실패해야 함', () => {
      const result = birthDateValidator.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.birthDate.required);
      }
    });

    it('잘못된 형식은 실패해야 함', () => {
      const result1 = birthDateValidator.safeParse('1990/01/01');
      expect(result1.success).toBe(false);

      const result2 = birthDateValidator.safeParse('01-01-1990');
      expect(result2.success).toBe(false);

      const result3 = birthDateValidator.safeParse('1990.01.01');
      expect(result3.success).toBe(false);
    });

    it('YYYY-MM-DD 형식이 아니면 실패해야 함', () => {
      const result = birthDateValidator.safeParse('90-1-1');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.birthDate.format);
      }
    });

    it('2025-09-01 이후 날짜는 실패해야 함', () => {
      const result = birthDateValidator.safeParse('2025-09-01');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.birthDate.invalidDate);
      }
    });

    it('2025-09-01 이전 날짜는 통과해야 함', () => {
      expect(birthDateValidator.safeParse('2025-08-31').success).toBe(true);
      expect(birthDateValidator.safeParse('2024-12-31').success).toBe(true);
    });

    it('미래 날짜는 실패해야 함', () => {
      const result = birthDateValidator.safeParse('2030-01-01');
      expect(result.success).toBe(false);
    });
  });

  describe('nickname', () => {
    const nicknameValidator = validators.nickname();

    it('유효한 닉네임을 통과시켜야 함', () => {
      expect(nicknameValidator.safeParse('testuser').success).toBe(true);
      expect(nicknameValidator.safeParse('User123').success).toBe(true);
      expect(nicknameValidator.safeParse('abc').success).toBe(true);
    });

    it('빈 문자열은 실패해야 함', () => {
      const result = nicknameValidator.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.nickname.required);
      }
    });

    it('1자는 실패해야 함', () => {
      const result = nicknameValidator.safeParse('a');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.nickname.minLength);
      }
    });

    it('20자 초과는 실패해야 함', () => {
      const result = nicknameValidator.safeParse('a'.repeat(21));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.nickname.maxLength);
      }
    });

    it('20자는 통과해야 함', () => {
      expect(nicknameValidator.safeParse('a'.repeat(20)).success).toBe(true);
    });

    it('특수문자는 실패해야 함', () => {
      const result = nicknameValidator.safeParse('test_user');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.nickname.format);
      }
    });

    it('공백은 실패해야 함', () => {
      const result = nicknameValidator.safeParse('test user');
      expect(result.success).toBe(false);
    });

    it('한글은 실패해야 함', () => {
      const result = nicknameValidator.safeParse('테스트');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.nickname.format);
      }
    });

    it('영문자와 숫자 조합은 통과해야 함', () => {
      expect(nicknameValidator.safeParse('test123').success).toBe(true);
      expect(nicknameValidator.safeParse('123test').success).toBe(true);
      expect(nicknameValidator.safeParse('Te5t').success).toBe(true);
    });
  });

  describe('bio', () => {
    const bioValidator = validators.bio();

    it('유효한 소개글을 통과시켜야 함', () => {
      expect(bioValidator.safeParse('안녕하세요').success).toBe(true);
      expect(bioValidator.safeParse('Hello, I am a developer').success).toBe(true);
    });

    it('빈 문자열을 통과시켜야 함', () => {
      expect(bioValidator.safeParse('').success).toBe(true);
    });

    it('undefined를 통과시켜야 함', () => {
      expect(bioValidator.safeParse(undefined).success).toBe(true);
    });

    it('100자는 통과해야 함', () => {
      expect(bioValidator.safeParse('a'.repeat(100)).success).toBe(true);
    });

    it('100자 초과는 실패해야 함', () => {
      const result = bioValidator.safeParse('a'.repeat(101));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(VALIDATION_MESSAGES.bio.maxLength);
      }
    });

    it('특수문자와 이모지를 포함할 수 있어야 함', () => {
      expect(bioValidator.safeParse('Hello! 😊').success).toBe(true);
      expect(bioValidator.safeParse('안녕하세요! #개발자').success).toBe(true);
    });
  });
});
