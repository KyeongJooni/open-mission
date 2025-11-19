import { detectProfileChanges, getUpdateStrategy, buildUpdateRequest } from '../profileHelpers';
import type { SignupFormData } from '@/utils/schemas';

describe('profileHelpers', () => {
  const mockUser = {
    email: 'test@example.com',
    nickname: 'testUser',
    profilePicture: 'https://example.com/profile.jpg',
    birthDate: '1990-01-01',
    name: 'Test Name',
    introduction: 'Hello, I am a test user',
  };

  describe('detectProfileChanges', () => {
    it('변경사항이 없으면 빈 배열을 반환해야 함', () => {
      const data: Partial<SignupFormData> = {
        nickname: 'testUser',
        introduction: 'Hello, I am a test user',
        birthDate: '1990-01-01',
      };

      const result = detectProfileChanges(data, mockUser);

      expect(result).toEqual([]);
    });

    it('닉네임 변경을 감지해야 함', () => {
      const data: Partial<SignupFormData> = {
        nickname: 'newNickname',
      };

      const result = detectProfileChanges(data, mockUser);

      expect(result).toEqual([{ field: 'nickname', value: 'newNickname' }]);
    });

    it('소개글 변경을 감지해야 함', () => {
      const data: Partial<SignupFormData> = {
        introduction: 'New introduction',
      };

      const result = detectProfileChanges(data, mockUser);

      expect(result).toEqual([{ field: 'introduction', value: 'New introduction' }]);
    });

    it('소개글을 빈 문자열로 변경하는 것도 감지해야 함', () => {
      const data: Partial<SignupFormData> = {
        introduction: '',
      };

      const result = detectProfileChanges(data, mockUser);

      expect(result).toEqual([{ field: 'introduction', value: '' }]);
    });

    it('생년월일 변경을 감지해야 함', () => {
      const data: Partial<SignupFormData> = {
        birthDate: '2000-12-31',
      };

      const result = detectProfileChanges(data, mockUser);

      expect(result).toEqual([{ field: 'birthDate', value: '2000-12-31' }]);
    });

    it('여러 필드의 변경을 동시에 감지해야 함', () => {
      const data: Partial<SignupFormData> = {
        nickname: 'newNickname',
        introduction: 'New intro',
        birthDate: '2000-01-01',
      };

      const result = detectProfileChanges(data, mockUser);

      expect(result).toEqual([
        { field: 'nickname', value: 'newNickname' },
        { field: 'introduction', value: 'New intro' },
        { field: 'birthDate', value: '2000-01-01' },
      ]);
    });

    it('introduction이 undefined인 유저의 경우도 처리해야 함', () => {
      const userWithoutIntro = { ...mockUser, introduction: undefined };
      const data: Partial<SignupFormData> = {
        introduction: 'New introduction',
      };

      const result = detectProfileChanges(data, userWithoutIntro);

      expect(result).toEqual([{ field: 'introduction', value: 'New introduction' }]);
    });
  });

  describe('getUpdateStrategy', () => {
    it('변경사항이 없으면 "none" 전략을 반환해야 함', () => {
      const changes: any[] = [];

      const result = getUpdateStrategy(changes);

      expect(result).toEqual({ type: 'none' });
    });

    it('닉네임만 변경되면 "single" 전략을 반환해야 함', () => {
      const changes = [{ field: 'nickname', value: 'newNickname' }];

      const result = getUpdateStrategy(changes);

      expect(result).toEqual({
        type: 'single',
        field: 'nickname',
        value: 'newNickname',
      });
    });

    it('소개글만 변경되면 "multiple" 전략을 반환해야 함', () => {
      const changes = [{ field: 'introduction', value: 'New intro' }];

      const result = getUpdateStrategy(changes);

      expect(result).toEqual({ type: 'multiple' });
    });

    it('생년월일만 변경되면 "multiple" 전략을 반환해야 함', () => {
      const changes = [{ field: 'birthDate', value: '2000-01-01' }];

      const result = getUpdateStrategy(changes);

      expect(result).toEqual({ type: 'multiple' });
    });

    it('여러 필드가 변경되면 "multiple" 전략을 반환해야 함', () => {
      const changes = [
        { field: 'nickname', value: 'newNickname' },
        { field: 'introduction', value: 'New intro' },
      ];

      const result = getUpdateStrategy(changes);

      expect(result).toEqual({ type: 'multiple' });
    });
  });

  describe('buildUpdateRequest', () => {
    it('변경된 필드만 새 값을 사용하고 나머지는 기존 값을 유지해야 함', () => {
      const data: Partial<SignupFormData> = {
        nickname: 'newNickname',
      };

      const result = buildUpdateRequest(data, mockUser);

      expect(result).toEqual({
        email: 'test@example.com',
        nickname: 'newNickname',
        profilePicture: 'https://example.com/profile.jpg',
        birthDate: '1990-01-01',
        name: 'Test Name',
        introduction: '',
      });
    });

    it('모든 필드가 변경되면 모두 새 값을 사용해야 함', () => {
      const data: Partial<SignupFormData> = {
        email: 'new@example.com',
        nickname: 'newNickname',
        birthDate: '2000-01-01',
        name: 'New Name',
        introduction: 'New intro',
      };

      const result = buildUpdateRequest(data, mockUser);

      expect(result).toEqual({
        email: 'new@example.com',
        nickname: 'newNickname',
        profilePicture: 'https://example.com/profile.jpg',
        birthDate: '2000-01-01',
        name: 'New Name',
        introduction: 'New intro',
      });
    });

    it('introduction이 없으면 빈 문자열을 사용해야 함', () => {
      const data: Partial<SignupFormData> = {
        nickname: 'newNickname',
      };

      const result = buildUpdateRequest(data, mockUser);

      expect(result.introduction).toBe('');
    });

    it('profilePicture는 항상 기존 유저의 값을 유지해야 함', () => {
      const data: Partial<SignupFormData> = {
        nickname: 'newNickname',
        // profilePicture는 data에 없음
      };

      const result = buildUpdateRequest(data, mockUser);

      expect(result.profilePicture).toBe('https://example.com/profile.jpg');
    });

    it('빈 객체를 전달하면 기존 유저 정보를 유지해야 함 (introduction 제외)', () => {
      const data: Partial<SignupFormData> = {};

      const result = buildUpdateRequest(data, mockUser);

      expect(result).toEqual({
        email: 'test@example.com',
        nickname: 'testUser',
        profilePicture: 'https://example.com/profile.jpg',
        birthDate: '1990-01-01',
        name: 'Test Name',
        introduction: '',
      });
    });
  });

  describe('통합 시나리오', () => {
    it('변경 감지 -> 전략 결정 -> 요청 생성 전체 플로우가 작동해야 함', () => {
      const data: Partial<SignupFormData> = {
        nickname: 'updatedNickname',
      };

      // 1. 변경 감지
      const changes = detectProfileChanges(data, mockUser);
      expect(changes).toHaveLength(1);

      // 2. 전략 결정
      const strategy = getUpdateStrategy(changes);
      expect(strategy.type).toBe('single');
      expect(strategy.field).toBe('nickname');

      // 3. 요청 생성
      const request = buildUpdateRequest(data, mockUser);
      expect(request.nickname).toBe('updatedNickname');
    });

    it('복수 필드 변경 시 전체 플로우가 작동해야 함', () => {
      const data: Partial<SignupFormData> = {
        nickname: 'updatedNickname',
        introduction: 'Updated intro',
        birthDate: '1995-05-15',
      };

      // 1. 변경 감지
      const changes = detectProfileChanges(data, mockUser);
      expect(changes).toHaveLength(3);

      // 2. 전략 결정
      const strategy = getUpdateStrategy(changes);
      expect(strategy.type).toBe('multiple');

      // 3. 요청 생성
      const request = buildUpdateRequest(data, mockUser);
      expect(request.nickname).toBe('updatedNickname');
      expect(request.introduction).toBe('Updated intro');
      expect(request.birthDate).toBe('1995-05-15');
    });
  });
});
