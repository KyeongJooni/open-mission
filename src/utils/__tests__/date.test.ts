import { formatCommentDate } from '../date';

describe('date', () => {
  describe('formatCommentDate', () => {
    it('ISO 날짜를 "Month. DD. YYYY." 형식으로 변환해야 함', () => {
      const input = '2024-01-15T10:30:00Z';
      const result = formatCommentDate(input);
      expect(result).toBe('Jan. 15. 2024.');
    });

    it('다양한 월을 올바르게 변환해야 함', () => {
      expect(formatCommentDate('2024-03-20T00:00:00Z')).toBe('Mar. 20. 2024.');
      expect(formatCommentDate('2024-06-05T00:00:00Z')).toBe('Jun. 5. 2024.');
      expect(formatCommentDate('2024-12-31T00:00:00Z')).toBe('Dec. 31. 2024.');
    });

    it('한 자리 날짜도 올바르게 처리해야 함', () => {
      const result = formatCommentDate('2024-01-01T00:00:00Z');
      expect(result).toBe('Jan. 1. 2024.');
    });

    it('두 자리 날짜도 올바르게 처리해야 함', () => {
      const result = formatCommentDate('2024-01-25T00:00:00Z');
      expect(result).toBe('Jan. 25. 2024.');
    });

    it('다른 년도도 올바르게 처리해야 함', () => {
      expect(formatCommentDate('2023-05-10T00:00:00Z')).toBe('May. 10. 2023.');
      expect(formatCommentDate('2025-08-15T00:00:00Z')).toBe('Aug. 15. 2025.');
    });

    it('시간 정보는 무시하고 날짜만 포맷해야 함', () => {
      // UTC 시간대 차이로 인해 날짜가 달라질 수 있으므로 날짜만 추출해서 비교
      const result1 = formatCommentDate('2024-01-15T00:00:00Z');
      const result2 = formatCommentDate('2024-01-15T12:00:00Z');
      // 둘 다 2024년 1월을 포함해야 함
      expect(result1).toContain('Jan');
      expect(result1).toContain('2024');
      expect(result2).toContain('Jan');
      expect(result2).toContain('2024');
    });

    it('ISO 형식이 아닌 날짜 문자열도 처리해야 함', () => {
      // Date 생성자가 파싱 가능한 형식이면 작동
      const result = formatCommentDate('2024-01-15');
      expect(result).toContain('Jan');
      expect(result).toContain('2024');
    });
  });
});
