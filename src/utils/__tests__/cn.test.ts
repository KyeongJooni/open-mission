import { cn } from '../cn';

describe('cn', () => {
  describe('기본 동작', () => {
    it('단일 클래스를 반환해야 함', () => {
      expect(cn('foo')).toBe('foo');
    });

    it('여러 클래스를 합쳐야 함', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('빈 인자를 무시해야 함', () => {
      expect(cn('foo', '', 'bar')).toBe('foo bar');
    });

    it('인자가 없으면 빈 문자열을 반환해야 함', () => {
      expect(cn()).toBe('');
    });
  });

  describe('조건부 클래스', () => {
    it.each([
      [{ foo: true }, 'foo'],
      [{ foo: false }, ''],
      [{ foo: true, bar: false }, 'foo'],
      [{ foo: true, bar: true }, 'foo bar'],
    ])('객체 %p는 %s를 반환해야 함', (input, expected) => {
      expect(cn(input)).toBe(expected);
    });

    it('undefined와 null을 무시해야 함', () => {
      expect(cn('foo', undefined, 'bar', null)).toBe('foo bar');
    });

    it('false와 0을 무시해야 함', () => {
      expect(cn('foo', false, 'bar', 0)).toBe('foo bar');
    });
  });

  describe('배열 처리', () => {
    it('배열 내 클래스를 펼쳐야 함', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar');
    });

    it('중첩 배열을 처리해야 함', () => {
      expect(cn(['foo', ['bar', 'baz']])).toBe('foo bar baz');
    });

    it('배열과 문자열을 함께 처리해야 함', () => {
      expect(cn('foo', ['bar', 'baz'], 'qux')).toBe('foo bar baz qux');
    });
  });

  describe('Tailwind 클래스 병합', () => {
    it.each([
      [['p-4', 'p-2'], 'p-2'],
      [['px-4', 'px-2'], 'px-2'],
      [['text-red-500', 'text-blue-500'], 'text-blue-500'],
      [['bg-red-500', 'bg-blue-500'], 'bg-blue-500'],
      [['m-4', 'mx-2'], 'm-4 mx-2'],
      [['font-bold', 'font-normal'], 'font-normal'],
    ])('충돌하는 클래스 %p는 %s로 병합되어야 함', (inputs, expected) => {
      expect(cn(...inputs)).toBe(expected);
    });

    it('충돌하지 않는 클래스는 모두 유지해야 함', () => {
      expect(cn('p-4', 'm-2', 'text-red-500')).toBe('p-4 m-2 text-red-500');
    });

    it('복잡한 Tailwind 클래스 조합을 처리해야 함', () => {
      expect(cn(
        'flex items-center',
        'justify-between',
        { 'bg-red-500': true },
        'p-4'
      )).toBe('flex items-center justify-between bg-red-500 p-4');
    });
  });

  describe('실제 사용 케이스', () => {
    it('버튼 스타일링 예시', () => {
      const isDisabled = true;
      const isPrimary = true;

      const result = cn(
        'px-4 py-2 rounded',
        isPrimary && 'bg-blue-500 text-white',
        isDisabled && 'opacity-50 cursor-not-allowed'
      );

      expect(result).toBe('px-4 py-2 rounded bg-blue-500 text-white opacity-50 cursor-not-allowed');
    });

    it('조건부 스타일 오버라이드', () => {
      const variant = 'danger';

      const result = cn(
        'bg-gray-500',
        variant === 'danger' && 'bg-red-500'
      );

      expect(result).toBe('bg-red-500');
    });
  });
});
